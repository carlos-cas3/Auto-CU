const UseCaseList = ({ items }) => {
    return (
        <div>
            {items.map((cu) => (
                <div key={cu.id} className="border rounded p-2 mb-2 bg-white">
                    <p><strong>ID:</strong> {cu.displayId}</p>
                    <p><strong>Área:</strong> {cu.area}</p>
                    <p><strong>Rol:</strong> {cu.role}</p>
                    <p><strong>Acción:</strong> {cu.action}</p>
                    <p><strong>Propósito:</strong> {cu.purpose}</p>
                </div>
            ))}
        </div>
    );
};

export default UseCaseList;
