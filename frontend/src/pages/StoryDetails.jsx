// src/pages/StoryDetails.jsx
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { getStoryById } from "../services/storyService";
import StoryTabs from "../components/StoryViewer/StoryTabs.jsx";
import { parseStoryData } from "../utils/parseUtils";

const StoryDetails = () => {
    const [useCaseIdInput, setUseCaseIdInput] = useState("");
    const [storyData, setStoryData] = useState(null);
    const [searchStatus, setSearchStatus] = useState("idle");

    const handleUseCaseSearch = async () => {
        const trimmedId = useCaseIdInput.trim();

        if (trimmedId.length !== 36) {
            setSearchStatus("invalid_length");
            return;
        }

        setSearchStatus("searching");

        try {
            const data = await getStoryById(trimmedId);
            console.log("🧩 Datos recibidos del backend:", data);

            if (!data || !data.use_cases) {
                throw new Error("Datos incompletos");
            }

            const parsedData = parseStoryData(data);
            setStoryData(parsedData);
            setSearchStatus("found");
        } catch (err) {
            console.error("❌ Error al parsear los datos:", err);
            setStoryData(null);
            setSearchStatus("not_found");
        }
    };

    return (
        <div className="bg-gray-600 min-h-screen flex justify-center items-start">
            <div className="bg-green-50 rounded-lg shadow-inner p-5 gap-3 m-5 max-w-3xl w-full">
                <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center">
                    <HiSearch className="text-3xl mr-2" />
                    Vista de Casos de Uso
                </h2>

                <p className="text-gray-600 mb-2">
                    Ingresa un ID válido para ver sus resultados:
                </p>
                <p className="text-gray-600 mb-4">
                    Visualizar casos de uso, requerimientos funcionales y casos
                    de prueba relacionados
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Ej: 75a49388-f59c-4758-aa09-b6a05ef86840"
                        value={useCaseIdInput}
                        onChange={(e) => {
                            setUseCaseIdInput(e.target.value);
                            if (searchStatus !== "idle")
                                setSearchStatus("idle");
                        }}
                        maxLength={36}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button
                        onClick={handleUseCaseSearch}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 ease-in-out shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Buscar
                    </button>
                </div>

                {searchStatus === "invalid_length" && (
                    <p className="text-red-600 font-medium mt-2">
                        El ID ingresado debe tener exactamente 36 caracteres.
                    </p>
                )}
                {searchStatus === "searching" && (
                    <p className="text-center text-green-700 font-medium animate-pulse">
                        Buscando información...
                    </p>
                )}
                {searchStatus === "not_found" && (
                    <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-inner">
                        <p className="text-2xl font-bold mb-2">¡Ups! 😔</p>
                        <p className="text-lg">
                            No se encontró información para el ID "
                            <span className="font-mono">{useCaseIdInput}</span>
                            ".
                            <br />
                            Por favor, verifica el ID ingresado y vuelve a
                            intentarlo.
                        </p>
                    </div>
                )}

                {storyData && searchStatus === "found" && (
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            {storyData.title}
                        </h3>
                        <StoryTabs
                            useCases={storyData.useCases}
                            requirements={storyData.requirements}
                            testCases={storyData.testCases}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryDetails;
