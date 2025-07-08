// src/components/StoryViewer/StoryTabs.jsx
import { useState } from "react";
import UseCaseList from "./UseCaseList";
import RequirementList from "./RequirementList";
import TestCaseList from "./TestCaseList";

const tabs = ["Casos de Uso", "Requisitos Funcionales", "Casos de Prueba"];

const StoryTabs = ({ useCases, requirements, testCases }) => {
    const [active, setActive] = useState(0);

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={`py-2 px-4 ${
                            i === active ? "border-b-2 font-bold" : ""
                        }`}
                        onClick={() => setActive(i)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {active === 0 && <UseCaseList items={useCases} />}
            {active === 1 && <RequirementList items={requirements} />}
            {active === 2 && <TestCaseList items={testCases} />}
        </div>
    );
};

export default StoryTabs;
