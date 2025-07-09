const TestCaseList = ({ items }) => {
    return (
        <div>
            {items.map((tc) => {
                console.log("➡️ TC:", tc.title, tc.relatedUseCases, tc.relatedRequirements); // ✅ Mueve aquí

                return (
                    <div
                        key={tc.id}
                        className="border rounded p-4 mb-4 bg-white shadow"
                    >
                        <p><strong>Título:</strong> {tc.title}</p>
                        <p><strong>Objetivo:</strong> {tc.objective}</p>

                        <p><strong>Precondiciones:</strong></p>
                        <ul className="list-disc ml-6">
                            {tc.preconditions.map((p, i) => (
                                <li key={i}>{p}</li>
                            ))}
                        </ul>

                        <p><strong>Pasos:</strong></p>
                        <ul className="list-decimal ml-6">
                            {tc.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>

                        <p><strong>Resultado Esperado:</strong></p>
                        <ul className="list-disc ml-6">
                            {tc.expectedResult.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>

                        {/* Casos de Uso Relacionados */}
                        {tc.relatedUseCases?.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold text-green-700">
                                    📘 Casos de Uso Relacionados:
                                </p>
                                <ul className="list-disc ml-6">
                                    {tc.relatedUseCases.map((cu, i) => (
                                        <li key={i}>
                                            <span className="font-semibold text-green-800">
                                                {cu.displayId} -{" "}
                                            </span>
                                            <strong>Área:</strong> {cu.area},{" "}
                                            <strong>Rol:</strong> {cu.role},{" "}
                                            <strong>Acción:</strong> {cu.action},{" "}
                                            <strong>Propósito:</strong> {cu.purpose}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Requerimientos Funcionales Relacionados */}
                        {tc.relatedRequirements?.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold text-blue-700">
                                    🧩 Requerimientos Funcionales Relacionados:
                                </p>
                                <ul className="list-disc ml-6">
                                    {tc.relatedRequirements.map((rf, i) => (
                                        <li key={i}>
                                            <span className="font-semibold text-blue-800">
                                                {rf.displayId} -{" "}
                                            </span>
                                            <strong>Módulo:</strong> {rf.module},{" "}
                                            <strong>Función:</strong> {rf.func},{" "}
                                            <strong>Disparador:</strong> {rf.trigger},{" "}
                                            <strong>Comportamiento:</strong> {rf.behavior}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TestCaseList;
