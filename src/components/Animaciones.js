import React, { useEffect, useState } from "react";
import { useRos } from "../contexts/RosContext";
import { createTopic, createService } from "../services/RosManager";
import * as ROSLIB from "roslib";

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [animations, setAnimations] = useState({});
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [animationList, setAnimationList] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAnimation, setSelectedAnimation] = useState("");

    const animationTopic = createTopic(ros, "/animations", "robot_toolkit_msgs/animation_msg");

    useEffect(() => {
        console.log("Iniciando carga de animations.txt...");
        fetch("/animations/animations.txt")
            .then(response => response.text())
            .then(text => {
                console.log("Contenido de animations.txt recibido:", text);
                const parsedAnimations = {};
                const categorySet = new Set();

                text.split("\n").forEach((line, index) => {
                    line = line.trim();
                    if (!line) return;

                    const parts = line.split("/");
                    console.log(`Procesando línea ${index}: `, parts);

                    if (parts.length >= 3) {
                        const [category, subcategory, ...animationParts] = parts;
                        const animation = animationParts.join("/");

                        if (!parsedAnimations[category]) {
                            parsedAnimations[category] = {};
                            categorySet.add(category);
                        }
                        if (!parsedAnimations[category][subcategory]) {
                            parsedAnimations[category][subcategory] = [];
                        }
                        parsedAnimations[category][subcategory].push(animation);
                    }
                });

                console.log("Estructura final de animations:", parsedAnimations);
                setAnimations(parsedAnimations);
                setCategories(Array.from(categorySet));
            })
            .catch(error => console.error("Error al cargar las animaciones:", error));
    }, []);

    useEffect(() => {
        if (ros) {
            console.log("Inicializando Motion Tools Service...");
            const enableMotionService = createService(ros, "/robot_toolkit/motion_tools_srv", "robot_toolkit_msgs/motion_tools_srv");
            const motionRequest = { data: { command: "enable_all" } };

            enableMotionService.callService(motionRequest, (result) => {
                console.log("Motion tools service initialized:", result);
            }, (error) => {
                console.error("Error initializing motion service:", error);
            });
        }
    }, [ros]);

    const handleCategoryChange = (category) => {
        console.log(`Categoría seleccionada: ${category}`);
        setSelectedCategory(category);
        setSelectedSubcategory("");
        setSelectedAnimation("");
        setSubcategories(category ? Object.keys(animations[category] || {}) : []);
        setAnimationList([]);
    };

    const handleSubcategoryChange = (subcategory) => {
        console.log(`Subcategoría seleccionada: ${subcategory}`);
        setSelectedSubcategory(subcategory);
        setSelectedAnimation("");
        setAnimationList(subcategory ? (animations[selectedCategory]?.[subcategory] || []) : []);
    };

    const handleAnimation = () => {
        if (!selectedCategory || !selectedSubcategory || !selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        const fullAnimationPath = `${selectedCategory}/${selectedSubcategory}/${selectedAnimation}`;
        console.log(`Enviando animación: ${fullAnimationPath}`);

        const message = new ROSLIB.Message({ family: "animations", animation_name: fullAnimationPath });

        if (animationTopic) {
            animationTopic.publish(message);
            console.log(`Animación enviada: ${fullAnimationPath}`);
        } else {
            console.error("El publicador de animaciones no está disponible.");
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Control de Animaciones del Robot</h2>
            <div>
                <label>Categoría:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">Seleccione una categoría</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            {selectedCategory && (
                <div>
                    <label>Subcategoría:</label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                    >
                        <option value="">Seleccione una subcategoría</option>
                        {subcategories.map(subcategory => (
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
                        {animationList.map(anim => (
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