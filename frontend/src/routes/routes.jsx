import MainLayout from "../layouts/MainLayout.jsx";
import Start from "../pages/Start.jsx";
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
        ],
    },
];

export default routes;
