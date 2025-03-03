import React, { useEffect, useState } from "react";
import { useRos } from "../contexts/RosContext";
import { createTopic, createService } from "../services/RosManager";
import * as ROSLIB from "roslib";

// Importar animaciones desde el archivo de texto
const loadAnimations = async () => {
  const response = await fetch("/animations/animations.txt");
  const text = await response.text();
  return text.split("\n").filter((line) => line.trim() !== "");
};

const RobotAnimationControl = () => {
  const { ros } = useRos();
  const [animations, setAnimations] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedAnimation, setSelectedAnimation] = useState("");

  const animationTopic = createTopic(ros, "/animations", "robot_toolkit_msgs/animation_msg");

  useEffect(() => {
    loadAnimations().then((lines) => {
      const categories = {};

      lines.forEach((line) => {
        const parts = line.split("/");
        if (parts.length >= 2) {
          const [category, subcategory, animation] = parts;
          if (!categories[category]) categories[category] = {};
          if (!categories[category][subcategory]) categories[category][subcategory] = [];
          categories[category][subcategory].push(line);
        }
      });

      setAnimations(categories);
    });
  }, []);

  const handleAnimation = () => {
    if (!selectedAnimation) {
      alert("Seleccione una animación para ejecutar.");
      return;
    }

    const message = new ROSLIB.Message({
      family: "animations",
      animation_name: selectedAnimation,
    });

    if (animationTopic) {
      animationTopic.publish(message);
      console.log(`Animación enviada: ${selectedAnimation}`);
    } else {
      console.error("El publicador de animaciones no está disponible.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Control de Animaciones del Robot</h2>

      {/* Seleccionar categoría */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Seleccione una categoría</option>
        {Object.keys(animations).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Seleccionar subcategoría */}
      {selectedCategory && animations[selectedCategory] && (
        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          <option value="">Seleccione una subcategoría</option>
          {Object.keys(animations[selectedCategory]).map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      )}

      {/* Seleccionar animación */}
      {selectedSubcategory && animations[selectedCategory][selectedSubcategory] && (
        <select value={selectedAnimation} onChange={(e) => setSelectedAnimation(e.target.value)}>
          <option value="">Seleccione una animación</option>
          {animations[selectedCategory][selectedSubcategory].map((animation, index) => (
            <option key={index} value={animation}>
              {animation}
            </option>
          ))}
        </select>
      )}

      <button onClick={handleAnimation}>Ejecutar Animación</button>
    </div>
  );
};

export default RobotAnimationControl;