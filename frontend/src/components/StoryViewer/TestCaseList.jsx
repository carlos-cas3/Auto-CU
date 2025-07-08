// src/components/StoryViewer/TestCaseList.jsx
const TestCaseList = ({ items }) => {
    return (
        <div>
            {items.map((tc) => (
                <div key={tc.id} className="border rounded p-2 mb-2">
                    <p>{tc.original_text}</p>
                </div>
            ))}
        </div>
    );
};

export default TestCaseList;
