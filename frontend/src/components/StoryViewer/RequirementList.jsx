const RequirementList = ({ items }) => {
    return (
        <div>
            {items.map((req) => (
                <div key={req.id} className="border rounded p-2 mb-2 bg-white">
                    <p><strong>ID:</strong> {req.displayId}</p>
                    <p><strong>Módulo:</strong> {req.module}</p>
                    <p><strong>Función:</strong> {req.func}</p>
                    <p><strong>Disparador:</strong> {req.trigger}</p>
                    <p><strong>Comportamiento:</strong> {req.behavior}</p>
                </div>
            ))}
        </div>
    );
};

export default RequirementList;
