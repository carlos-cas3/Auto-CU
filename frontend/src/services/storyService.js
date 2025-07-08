// src/services/storyService.js
const BASE_URL = "http://localhost:5000/api"; //crear env 
// para la url base

export const getStoryById = async (id) => {
    const res = await fetch(`${BASE_URL}/story/${id}`);
    if (!res.ok) throw new Error("Error al obtener la historia");
    return await res.json();
};