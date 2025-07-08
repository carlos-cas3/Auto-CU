const { supabase } = require("../config/supabase");

function buildCUandRF(test_cases) {
    const cuMap = new Map();
    const rfMap = new Map();

    for (const { cu, rf } of test_cases) {
        if (!cuMap.has(cu)) {
            cuMap.set(cu, { original: cu, cleaned: null });
        }
        if (!rfMap.has(rf)) {
            rfMap.set(rf, { original: rf, cleaned: null });
        }
    }

    return {
        valid_cu: [...cuMap.values()],
        valid_rf: [...rfMap.values()],
    };
}

exports.saveAnalyzeOutput = async (storyId, analyzeResult) => {
    const { test_cases } = analyzeResult;
    const { valid_cu, valid_rf } = buildCUandRF(test_cases);

    // Reutilizar la función original para guardar
    return await saveLangchainResults(storyId, {
        valid_cu,
        valid_rf,
        test_cases,
    });
};

// Puedes mover esta función si no está en el mismo archivo
async function saveLangchainResults(storyId, langchainResult) {
    const { valid_cu, valid_rf, test_cases } = langchainResult;

    const cuMap = new Map();
    const rfMap = new Map();
    const testCaseMap = new Map();

    console.log(`💾 Guardando resultados para historia: ${storyId}`);
    console.log(`🧪 Casos de prueba generados: ${test_cases.length}`);
    console.log(`✅ CU únicos: ${valid_cu.length}`);
    console.log(`✅ RF únicos: ${valid_rf.length}`);

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

        if (error) {
            console.error("❌ Error al insertar CU:", cu.original);
            throw new Error("Error al insertar CU: " + error.message);
        }

        console.log(`📝 CU insertado: "${cu.original}" → ID ${data.id}`);
        cuMap.set(cu.original, data.id);
    }

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

        if (error) {
            console.error("❌ Error al insertar RF:", rf.original);
            throw new Error("Error al insertar RF: " + error.message);
        }

        console.log(`📋 RF insertado: "${rf.original}" → ID ${data.id}`);
        rfMap.set(rf.original, data.id);
    }

    for (const tc of test_cases) {
        const { cu, rf, similarity, cluster, test_case } = tc;

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

        if (tcError) {
            console.error("❌ Error al insertar Test Case:", test_case);
            throw new Error("Error al insertar Test Case: " + tcError.message);
        }

        const testCaseId = tcData.id;
        console.log(`🧪 Test Case insertado (cluster ${cluster}, sim ${similarity.toFixed(2)}):`);
        console.log(`   ↪ "${test_case}"`);
        testCaseMap.set(test_case, testCaseId);

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

    console.log("✅ Inserción de todos los datos completada.");
    return {
        use_cases: [...cuMap.entries()],
        requirements: [...rfMap.entries()],
        test_cases: [...testCaseMap.entries()],
    };
}

