// services/test_generation.service.js

const { supabase } = require("../config/supabase");

exports.saveAnalyzeOutput = async (storyId, analyzeResult) => {
    const { test_cases, valid_cu, valid_rf } = analyzeResult;
    return await saveLangchainResults(storyId, {
        test_cases,
        valid_cu,
        valid_rf,
    });
};

async function saveLangchainResults(
    storyId,
    { test_cases, valid_cu, valid_rf }
) {
    const cuMap = new Map();
    const rfMap = new Map();
    const testCaseMap = new Map();

    // Insert CU
    for (const cu of valid_cu) {
        const { data, error } = await supabase
            .from("use_case")
            .insert([
                {
                    story_id: storyId,
                    original_text: cu.original,
                    cleaned_text: cu.cleaned || null,
                },
            ])
            .select("id")
            .single();

        if (error) throw new Error("Error al insertar CU: " + error.message);
        cuMap.set(cu.original, data.id);
    }

    // Insert RF
    for (const rf of valid_rf) {
        const { data, error } = await supabase
            .from("functional_requirement")
            .insert([
                {
                    story_id: storyId,
                    original_text: rf.original,
                    cleaned_text: rf.cleaned || null,
                },
            ])
            .select("id")
            .single();

        if (error) throw new Error("Error al insertar RF: " + error.message);
        rfMap.set(rf.original, data.id);
    }

    // Insert Test Cases
    for (const tc of test_cases) {
        const { test_case, similarity, cluster, cu, rf } = tc;

        const { data: tcData, error: tcError } = await supabase
            .from("test_case")
            .insert([
                {
                    story_id: storyId,
                    test_case_text: test_case,
                    cluster,
                    similarity,
                },
            ])
            .select("id")
            .single();

        if (tcError)
            throw new Error("Error al insertar Test Case: " + tcError.message);

        const testCaseId = tcData.id;

        // Relación con CU
        const cuValues = Array.isArray(tc.cu) ? tc.cu : [tc.cu];
        for (const cu of cuValues) {
            const cuId = cuMap.get(cu);
            if (cuId) {
                const { error } = await supabase
                    .from("test_case_use_case")
                    .insert([{ test_case_id: testCaseId, use_case_id: cuId }]);
                if (error) {
                    console.error("❌ Error relación CU-TC:", cu);
                    throw new Error("Error relación CU-TC: " + error.message);
                }
            }
        }

        // Relación con RF
        const rfValues = Array.isArray(tc.rf) ? tc.rf : [tc.rf];
        for (const rf of rfValues) {
            const rfId = rfMap.get(rf);
            if (rfId) {
                const { error } = await supabase
                    .from("test_case_functional_requirement")
                    .insert([
                        {
                            test_case_id: testCaseId,
                            functional_requirement_id: rfId,
                        },
                    ]);
                if (error) {
                    console.error("❌ Error relación RF-TC:", rf);
                    throw new Error("Error relación RF-TC: " + error.message);
                }
            }
        }

        testCaseMap.set(test_case, testCaseId);
    }

    return {
        use_cases: [...cuMap.entries()],
        requirements: [...rfMap.entries()],
        test_cases: [...testCaseMap.entries()],
    };
}
