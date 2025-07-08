// src/pages/StoryDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoryById } from "../services/storyService";
import StoryTabs from "../components/StoryViewer/StoryTabs";

const StoryDetails = () => {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getStoryById(id)
            .then(setStory)
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) return <p>Error: {error}</p>;
    if (!story) return <p>Cargando historia...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Historia: {story.title}</h2>
            <StoryTabs
                useCases={story.use_cases}
                requirements={story.functional_requirements}
                testCases={story.test_cases}
            />
        </div>
    );
};

export default StoryDetails;
