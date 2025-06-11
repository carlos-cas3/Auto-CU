import MainLayout from "../layouts/MainLayout.jsx";
import Start from "../pages/Start.jsx";
import ImageViewer from "../pages/ImageViewver.jsx";
import React from "react";

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
                path: "/view",
                element: <ImageViewer />
            }
        ],
    },
];

export default routes;
