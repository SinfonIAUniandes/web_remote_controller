import React, { useState, useEffect } from "react";
import { useRos } from "../contexts/RosContext";
import { createTopic } from "../services/RosManager";
import * as ROSLIB from "roslib";

// Ruta al archivo txt
import animationsTxt from "../animations/animations.txt";

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAnimation, setSelectedAnimation] = useState("");
    const [animations, setAnimations] = useState({});

    const animationTopic = createTopic(ros, "/animations", "robot_toolkit_msgs/animation_msg");

    useEffect(() => {
        fetch(animationsTxt)  // 📌 Cargamos el archivo de texto
            .then(response => response.text())
            .then(text => {
                const parsedAnimations = {};
                text.split("\n").forEach(animation => {
                    const parts = animation.trim().split("/");
                    if (parts.length >= 3) {
                        const [category, subcategory, ...animParts] = parts;
                        const animationName = animParts.join("/");

                        if (!parsedAnimations[category]) parsedAnimations[category] = {};
                        if (!parsedAnimations[category][subcategory]) parsedAnimations[category][subcategory] = [];
                        parsedAnimations[category][subcategory].push(animationName);
                    }
                });
                setAnimations(parsedAnimations);
                console.log("✅ Animaciones procesadas correctamente:", parsedAnimations);
            })
            .catch(error => console.error("❌ Error al cargar las animaciones:", error));
    }, []);

    const handleAnimation = () => {
        if (!selectedCategory || !selectedSubcategory || !selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        const fullAnimationPath = `${selectedCategory}/${selectedSubcategory}/${selectedAnimation}`;
        console.log(`🎬 Enviando animación: ${fullAnimationPath}`);

        const message = new ROSLIB.Message({ family: "animations", animation_name: fullAnimationPath });

        if (animationTopic) {
            animationTopic.publish(message);
            console.log(`✅ Animación enviada: ${fullAnimationPath}`);
        } else {
            console.error("❌ El publicador de animaciones no está disponible.");
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Control de Animaciones del Robot</h2>
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
            {selectedCategory && (
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
                            <option key={subcategory} value={subcategory}>{subcategory}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedSubcategory && (
                <div>
                    <label>Animación:</label>
                    <select
                        value={selectedAnimation}
                        onChange={(e) => setSelectedAnimation(e.target.value)}
                    >
                        <option value="">Seleccione una animación</option>
                        {animations[selectedCategory]?.[selectedSubcategory]?.map(anim => (
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