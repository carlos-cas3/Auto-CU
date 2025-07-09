export const parseStoryData = (storyData) => {
    const useCasesRaw = storyData.use_cases || [];
    const rfRaw = storyData.functional_requirements || [];
    const tcRaw = storyData.test_cases || [];

    const extractCUData = (text) => {
        const match = text?.match(/^(\d+)\.\s*\[Area: (.*?)\]\s*\[Role: (.*?)\]\s*\[Action: (.*?)\]\s*\[Purpose: (.*?)\]/);
        return match
            ? {
                displayId: `CU${match[1]}`,
                idNumber: parseInt(match[1]),
                area: match[2],
                role: match[3],
                action: match[4],
                purpose: match[5],
            }
            : {
                displayId: "CU?",
                idNumber: null,
                area: "N/A",
                role: "N/A",
                action: text,
                purpose: "N/A",
            };
    };

    const extractRFData = (text) => {
        const match = text?.match(/^(\d+)\.\s*\[Module: (.*?)\]\s*\[Function: (.*?)\]\s*\[Trigger: (.*?)\]\s*\[Behavior: (.*?)\]/);
        return match
            ? {
                displayId: `RF${match[1]}`,
                idNumber: parseInt(match[1]),
                module: match[2],
                func: match[3],
                trigger: match[4],
                behavior: match[5],
            }
            : {
                displayId: "RF?",
                idNumber: null,
                module: "N/A",
                func: "N/A",
                trigger: "N/A",
                behavior: text,
            };
    };

    const cleanUseCases = useCasesRaw.map((cu) => {
        const parsed = extractCUData(cu.original_text);
        return {
            id: cu.id,
            original_text: cu.original_text,
            cluster: cu.cluster ?? "N/A",
            ...parsed,
        };
    });

    const cleanRequirements = rfRaw.map((rf) => {
        const parsed = extractRFData(rf.original_text);
        return {
            id: rf.id,
            original_text: rf.original_text,
            cluster: rf.cluster ?? "N/A",
            ...parsed,
        };
    });

    const cleanTestCases = tcRaw.map((tc) => {
        const lines = tc.test_case_text?.split("\n").map((line) => line.trim()) || [];

        const sections = {
            title: "",
            objective: "",
            preconditions: [],
            steps: [],
            expectedResult: [],
        };

        const sectionMap = {
            title: ["title"],
            objective: ["objective"],
            preconditions: ["preconditions"],
            steps: ["test steps", "steps"],
            expectedResult: ["expected result", "results"],
        };

        let current = "";

        for (const line of lines) {
            if (!line) continue;

            const normalized = line.toLowerCase();
            const matchedSection = Object.entries(sectionMap).find(([, keywords]) =>
                keywords.some((kw) => normalized.startsWith(kw + ":") || normalized.startsWith("- " + kw + ":"))
            );

            if (matchedSection) {
                current = matchedSection[0];
                const content = line.split(/:(.+)/)[1]?.trim();
                if (content) {
                    if (current === "title") sections.title = content.replace(/\s*\(.*?\)\s*/g, "").trim();
                    else if (current === "objective") sections.objective = content;
                    else sections[current].push(content);
                }
                continue;
            }

            if (current) {
                const cleanedLine = line.replace(/^[-•\d.]*\s*/, "").trim();
                if (current === "title" || current === "objective") sections[current] += " " + cleanedLine;
                else sections[current].push(cleanedLine);
            }
        }

        const cuId = parseInt(tc.cu?.match(/^(\d+)\./)?.[1]);
        const rfId = parseInt(tc.rf?.match(/^(\d+)\./)?.[1]);

        const relatedCU = cleanUseCases.find((cu) => cu.idNumber === cuId);
        const relatedRF = cleanRequirements.find((rf) => rf.idNumber === rfId);

        return {
            id: tc.id,
            cluster: tc.cluster ?? "N/A",
            title: sections.title || "Sin título",
            objective: sections.objective || "Sin objetivo",
            preconditions: sections.preconditions,
            steps: sections.steps.filter(Boolean),
            expectedResult: sections.expectedResult.filter(Boolean),
            relatedUseCases: relatedCU ? [relatedCU] : [],
            relatedRequirements: relatedRF ? [relatedRF] : [],
        };
    });

    // Agrupar por cluster
    const clustersMap = {};
    [...cleanUseCases, ...cleanRequirements, ...cleanTestCases].forEach((item) => {
        const cluster = item.cluster || "N/A";
        if (!clustersMap[cluster]) {
            clustersMap[cluster] = {
                clusterId: cluster,
                useCases: [],
                requirements: [],
                testCases: [],
            };
        }
        if ("area" in item) clustersMap[cluster].useCases.push(item);
        else if ("module" in item) clustersMap[cluster].requirements.push(item);
        else if ("steps" in item) clustersMap[cluster].testCases.push(item);
    });

    const clusters = Object.values(clustersMap).sort((a, b) => parseInt(a.clusterId) - parseInt(b.clusterId));

    return {
        title: storyData.title || "Historia sin título",
        useCases: cleanUseCases,
        requirements: cleanRequirements,
        testCases: cleanTestCases,
        clusters,
    };
};
