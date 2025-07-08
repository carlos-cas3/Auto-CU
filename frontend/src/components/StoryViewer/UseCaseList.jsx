// src/components/StoryViewer/UseCaseList.jsx
const UseCaseList = ({ items }) => {
    return (
        <div>
            {items.map((cu) => (
                <div key={cu.id} className="border rounded p-2 mb-2">
                    <p>{cu.original_text}</p>
                </div>
            ))}
        </div>
    );
};

export default UseCaseList;
