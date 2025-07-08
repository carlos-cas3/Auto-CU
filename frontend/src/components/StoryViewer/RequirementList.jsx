// src/components/StoryViewer/RequirementList.jsx
const RequirementList = ({ items }) => {
    return (
        <div>
            {items.map((req) => (
                <div key={req.id} className="border rounded p-2 mb-2">
                    <p>{req.original_text}</p>
                </div>
            ))}
        </div>
    );
};

export default RequirementList;
