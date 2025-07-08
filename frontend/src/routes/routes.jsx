import MainLayout from "../layouts/MainLayout.jsx";
import Start from "../pages/Start.jsx";
import ImageViewer from "../pages/ImageViewer.jsx";
import React from "react";
import StoryDetails from "../pages/StoryDetails.jsx";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <Start />,
            },
            {
                path: "story",
                element: <StoryDetails />,
            },
            {
                path: "view",
                element: <ImageViewer />,
            },
        ],
    },
];

export default routes;
