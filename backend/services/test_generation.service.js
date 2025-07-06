const { supabase } = require("../config/supabase");

exports.saveLangchainResults = async (storyId, langchainResult) => {
    const { valid_cu, valid_rf, test_cases } = langchainResult;

    const cuMap = new Map(); // cu_text -> id
    const rfMap = new Map(); // rf_text -> id
    const testCaseMap = new Map(); // text -> id

    // 1. Guardar Casos de Uso
    for (const cu of valid_cu) {
        const { data, error } = await supabase
            .from("use_case")
            .insert([
                {
                    story_id: storyId,
                    original_text: cu.original,
                    cleaned_text: cu.cleaned,
                },
            ])
            .select("id")
            .single();

        if (error) throw new Error("Error al insertar CU: " + error.message);
        cuMap.set(cu.original, data.id);
    }

    // 2. Guardar Requisitos Funcionales
    for (const rf of valid_rf) {
        const { data, error } = await supabase
            .from("functional_requirement")
            .insert([
                {
                    story_id: storyId,
                    original_text: rf.original,
                    cleaned_text: rf.cleaned,
                },
            ])
            .select("id")
            .single();

        if (error) throw new Error("Error al insertar RF: " + error.message);
        rfMap.set(rf.original, data.id);
    }

    // 3. Guardar Casos de Prueba y sus relaciones
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

        if (tcError)
            throw new Error("Error al insertar Test Case: " + tcError.message);

        const testCaseId = tcData.id;
        testCaseMap.set(test_case, testCaseId);

        // Relaciones CU
        const cuId = cuMap.get(cu);
        if (cuId) {
            const { error } = await supabase
                .from("test_case_use_case")
                .insert([{ test_case_id: testCaseId, use_case_id: cuId }]);
            if (error)
                throw new Error("Error relación CU-TC: " + error.message);
        }

        // Relaciones RF
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
            if (error)
                throw new Error("Error relación RF-TC: " + error.message);
        }
    }

    return {
        use_cases: [...cuMap.entries()],
        requirements: [...rfMap.entries()],
        test_cases: [...testCaseMap.entries()],
    };
};
