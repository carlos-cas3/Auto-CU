import { useState } from "react";
import UseCaseList from "./UseCaseList";
import RequirementList from "./RequirementList";
import TestCaseList from "./TestCaseList";

const StoryTabs = ({ useCases = [], requirements = [], testCases = [] }) => {
    const [activeTab, setActiveTab] = useState("use_cases");

    return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            {/* Tabs */}
            <div className="flex justify-center mb-6">
                {[
                    { key: "use_cases", label: "Casos de Uso" },
                    { key: "requirements", label: "Requerimientos Funcionales" },
                    { key: "test_cases", label: "Casos de Prueba" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        className={`px-5 py-2 font-semibold text-sm border border-gray-300 
                        ${activeTab === key ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                        ${key === "use_cases" ? "rounded-l-lg" : ""}
                        ${key === "test_cases" ? "rounded-r-lg" : ""}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-4">
                {activeTab === "use_cases" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-green-700">📘 Casos de Uso</h3>
                        {useCases.length > 0 ? (
                            <UseCaseList items={useCases} />
                        ) : (
                            <p>No hay casos de uso.</p>
                        )}
                    </div>
                )}
                {activeTab === "requirements" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-green-700">🧩 Requerimientos Funcionales</h3>
                        {requirements.length > 0 ? (
                            <RequirementList items={requirements} />
                        ) : (
                            <p>No hay requerimientos funcionales.</p>
                        )}
                    </div>
                )}
                {activeTab === "test_cases" && (
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-green-700">🧪 Casos de Prueba</h3>
                        {testCases.length > 0 ? (
                            <TestCaseList items={testCases} />
                        ) : (
                            <p>No hay casos de prueba.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryTabs;
