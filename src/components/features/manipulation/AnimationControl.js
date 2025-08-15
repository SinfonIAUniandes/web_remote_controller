import React, { useState, useEffect } from "react";
import { useRos } from "../../../contexts/RosContext";
import { createService, callService } from "../../../services/RosManager";

// Rutas a los archivos txt de animaciones
import naoAnimationsTxt from "../../../assets/nao_animations.txt";
import pepperAnimationsTxt from "../../../assets/pepper_animations.txt";

const RobotAnimationControl = () => {
    const { ros, robotModel, posture } = useRos();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAnimation, setSelectedAnimation] = useState("");
    const [animations, setAnimations] = useState({});
    const [isNaoReady, setIsNaoReady] = useState(false);

    useEffect(() => {
        if (!robotModel) return;

        const isNao = robotModel === 'NAO';
        const animationsTxt = isNao ? naoAnimationsTxt : pepperAnimationsTxt;
        
        if (isNao) {
            const naoPosture = posture.toLowerCase();
            const ready = naoPosture === 'stand' || naoPosture === 'sit';
            setIsNaoReady(ready);
        } else {
            setIsNaoReady(true); // Pepper no depende de la postura para esto
        }

        fetch(animationsTxt)
            .then(response => response.text())
            .then(text => {
                const parsedAnimations = {};
                const lines = text.split("\n").filter(line => line.trim() !== "");
                const currentNaoPosture = posture.toLowerCase();

                lines.forEach(line => {
                    const parts = line.trim().split("/");
                    let category, subcategory, anim;

                    if (isNao) {
                        // Para NAO, filtramos por la postura actual (Sit/Stand)
                        const animationPosture = parts[0]?.toLowerCase();
                        if (animationPosture === currentNaoPosture) {
                            if (parts.length === 4) { // Stand/Category/Subcategory/Animation
                                [, category, subcategory, anim] = parts;
                                if (!parsedAnimations[category]) parsedAnimations[category] = {};
                                if (!parsedAnimations[category][subcategory]) parsedAnimations[category][subcategory] = [];
                                parsedAnimations[category][subcategory].push(anim);
                            } else if (parts.length === 3) { // Stand/Category/Animation
                                [, category, anim] = parts;
                                if (!parsedAnimations[category]) parsedAnimations[category] = {};
                                if (!parsedAnimations[category]["_no_subcategory"]) parsedAnimations[category]["_no_subcategory"] = [];
                                parsedAnimations[category]["_no_subcategory"].push(anim);
                            }
                        }
                    } else {
                        // Lógica original para Pepper
                        if (parts.length === 3) {
                            [category, subcategory, anim] = parts;
                            if (!parsedAnimations[category]) parsedAnimations[category] = {};
                            if (!parsedAnimations[category][subcategory]) parsedAnimations[category][subcategory] = [];
                            parsedAnimations[category][subcategory].push(anim);
                        } else if (parts.length === 2) {
                            [category, anim] = parts;
                            if (!parsedAnimations[category]) parsedAnimations[category] = {};
                            if (!parsedAnimations[category]["_no_subcategory"]) parsedAnimations[category]["_no_subcategory"] = [];
                            parsedAnimations[category]["_no_subcategory"].push(anim);
                        }
                    }
                });

                setAnimations(parsedAnimations);
                setSelectedCategory("");
                setSelectedSubcategory("");
                setSelectedAnimation("");
                console.log(`Animaciones para ${robotModel} procesadas:`, parsedAnimations);
            })
            .catch(error => console.error("Error al cargar las animaciones:", error));
    }, [robotModel, posture]);

    const handleAnimation = () => {
        if (!selectedCategory || (!selectedSubcategory && (!animations[selectedCategory] || animations[selectedCategory]["_no_subcategory"] === undefined)) || !selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        let animationPath;
        if (selectedSubcategory && selectedSubcategory !== "_no_subcategory") {
            animationPath = `${selectedCategory}/${selectedSubcategory}/${selectedAnimation}`;
        } else {
            animationPath = `${selectedCategory}/${selectedAnimation}`;
        }

        if (robotModel === 'NAO' && isNaoReady) {
            const capitalizedPosture = posture.charAt(0).toUpperCase() + posture.slice(1);
            animationPath = `${capitalizedPosture}/${animationPath}`;
        }
        else {
            animationPath = `Stand/${animationPath}`;
        }

        console.log(`Enviando animación: ${animationPath}`);

        // Llamar al servicio /play_animation
        const animationService = createService(ros, "/naoqi_manipulation_node/play_animation", "naoqi_utilities_msgs/srv/PlayAnimation");
        const request = { animation_name: animationPath };


        callService(animationService, request, (result) => {
            if (result.success) {
                console.log(`Animación ejecutada exitosamente: ${result.message}`);
            } else {
                console.error(`Error al ejecutar la animación: ${result.message}`);
            }
        });
    };

    const controlsDisabled = robotModel === 'NAO' && !isNaoReady;

    return (
        <div className="text-center flex flex-col h-full">
            <h2 className="text-lg font-semibold">Control de Animaciones ({robotModel || 'Detectando...'})</h2>
            <p className="text-sm text-gray-600 mb-2">Postura actual: <strong>{posture}</strong></p>
            
            {controlsDisabled && (
                <p className="text-red-500 text-xs italic mb-2">
                    El robot NAO debe estar en postura 'Stand' o 'Sit' para ejecutar animaciones.
                </p>
            )}

            {/* Contenedor de Selectores */}
            <div className="space-y-3 my-4">
                {/* Selección de Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSelectedSubcategory("");
                            setSelectedAnimation("");
                        }}
                        disabled={controlsDisabled}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Seleccione una categoría</option>
                        {Object.keys(animations).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Si la categoría tiene subcategorías, se muestra este select */}
                {selectedCategory && animations[selectedCategory] && Object.keys(animations[selectedCategory]).some(k => k !== "_no_subcategory") && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría:</label>
                        <select
                            value={selectedSubcategory}
                            onChange={(e) => {
                                setSelectedSubcategory(e.target.value);
                                setSelectedAnimation("");
                            }}
                            disabled={controlsDisabled}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Seleccione una subcategoría</option>
                            {Object.keys(animations[selectedCategory] || {}).map(subcategory => (
                                <option key={subcategory} value={subcategory}>{subcategory === "_no_subcategory" ? "Sin subcategoría" : subcategory}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Selección de Animación */}
                {selectedCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Animación:</label>
                        <select
                            value={selectedAnimation}
                            onChange={(e) => setSelectedAnimation(e.target.value)}
                            disabled={controlsDisabled}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Seleccione una animación</option>
                            {(animations[selectedCategory]?.[selectedSubcategory] || animations[selectedCategory]?._no_subcategory || []).map(anim => (
                                <option key={anim} value={anim}>{anim}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <button 
                onClick={handleAnimation} 
                disabled={!selectedAnimation || controlsDisabled}
                className="mt-auto w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
                Ejecutar Animación
            </button>
        </div>
    );
};

export default RobotAnimationControl;