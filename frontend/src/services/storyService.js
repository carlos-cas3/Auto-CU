export async function getStoryById(id) {
    const res = await fetch(`http://localhost:5000/api/story/${id}`);
    if (!res.ok) {
        throw new Error("No se pudo obtener la historia");
    }
    return await res.json();
}
