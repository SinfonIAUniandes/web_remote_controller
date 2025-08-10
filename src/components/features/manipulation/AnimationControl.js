import React, { useState, useEffect } from "react";
import { useRos } from "../../../contexts/RosContext";
import { createService, callService } from "../../../services/RosManager";

// Ruta al archivo txt
import animationsTxt from "../animations/animations.txt";

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAnimation, setSelectedAnimation] = useState("");
    const [animations, setAnimations] = useState({});

    useEffect(() => {
        fetch(animationsTxt)
            .then(response => response.text())
            .then(text => {
                const parsedAnimations = {};

                text.split("\n").forEach(animation => {
                    const parts = animation.trim().split("/");
                    
                    if (parts.length === 3) {  // Caso con 3 niveles: Categoría/Subcategoría/Animación
                        const [category, subcategory, anim] = parts;
                        if (!parsedAnimations[category]) parsedAnimations[category] = {};
                        if (!parsedAnimations[category][subcategory]) parsedAnimations[category][subcategory] = [];
                        parsedAnimations[category][subcategory].push(anim);
                    } else if (parts.length === 2) {  // Caso con 2 niveles: Categoría/Animación
                        const [category, anim] = parts;
                        if (!parsedAnimations[category]) parsedAnimations[category] = {};
                        if (!parsedAnimations[category]["_no_subcategory"]) parsedAnimations[category]["_no_subcategory"] = [];
                        parsedAnimations[category]["_no_subcategory"].push(anim);
                    }
                });

                setAnimations(parsedAnimations);
                console.log("Animaciones procesadas correctamente:", parsedAnimations);
            })
            .catch(error => console.error("Error al cargar las animaciones:", error));
    }, []);

    const handleAnimation = () => {
        if (!selectedCategory || (!selectedSubcategory && animations[selectedCategory]["_no_subcategory"] === undefined) || !selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        const fullAnimationPath = selectedSubcategory === "_no_subcategory"
            ? `${selectedCategory}/${selectedAnimation}`
            : `${selectedCategory}/${selectedSubcategory}/${selectedAnimation}`;

        console.log(`🎬 Enviando animación: ${fullAnimationPath}`);

        // Llamar al servicio /play_animation
        const animationService = createService(ros, "/naoqi_manipulation/play_animation", "naoqi_utilities_msgs/srv/PlayAnimation");
        const request = { animation_name: fullAnimationPath };

        callService(animationService, request, (result) => {
            if (result.success) {
                console.log(`Animación ejecutada exitosamente: ${result.message}`);
            } else {
                console.error(`Error al ejecutar la animación: ${result.message}`);
            }
        });
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Control de Animaciones del Robot</h2>
            
            {/* Selección de Categoría */}
            <div>
                <label>Categoría:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory("");
                        setSelectedAnimation("");
                    }}
                >
                    <option value="">Seleccione una categoría</option>
                    {Object.keys(animations).map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Si la categoría tiene subcategorías, se muestra este select */}
            {selectedCategory && Object.keys(animations[selectedCategory]).length > 1 && (
                <div>
                    <label>Subcategoría:</label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => {
                            setSelectedSubcategory(e.target.value);
                            setSelectedAnimation("");
                        }}
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
                    <label>Animación:</label>
                    <select
                        value={selectedAnimation}
                        onChange={(e) => setSelectedAnimation(e.target.value)}
                    >
                        <option value="">Seleccione una animación</option>
                        {(animations[selectedCategory]?.[selectedSubcategory] || animations[selectedCategory]?._no_subcategory || []).map(anim => (
                            <option key={anim} value={anim}>{anim}</option>
                        ))}
                    </select>
                </div>
            )}

            <button onClick={handleAnimation} disabled={!selectedAnimation}>Ejecutar Animación</button>
        </div>
    );
};

export default RobotAnimationControl;