import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const animationTopic = createTopic(ros, '/animations', 'robot_toolkit_msgs/animation_msg');

    useEffect(() => {
        fetch('/animations/animations.txt')
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n').filter(line => line.trim() !== '');
                const structuredData = {};

                lines.forEach(animation => {
                    const parts = animation.split('/');
                    if (parts.length >= 3) {
                        const [category, subcategory, name] = parts;
                        if (!structuredData[category]) structuredData[category] = {};
                        if (!structuredData[category][subcategory]) structuredData[category][subcategory] = [];
                        structuredData[category][subcategory].push(name);
                    }
                });
                setCategories(structuredData);
            })
            .catch(error => console.error("Error loading animations:", error));
    }, []);

    const handleAnimation = () => {
        if (!selectedCategory || !selectedSubcategory || !selectedAnimation) {
            alert("Seleccione una animación completa para ejecutar.");
            return;
        }

        const animationPath = `${selectedCategory}/${selectedSubcategory}/${selectedAnimation}`;
        const message = new ROSLIB.Message({
            family: "animations",
            animation_name: animationPath
        });

        if (animationTopic) {
            animationTopic.publish(message);
            console.log(`Animación enviada: ${animationPath}`);
        } else {
            console.error("El publicador de animaciones no está disponible.");
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Animaciones del Robot</h2>
            
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); setSelectedAnimation(''); }}>
                <option value="">Seleccione una categoría</option>
                {Object.keys(categories).map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>

            {selectedCategory && (
                <select value={selectedSubcategory} onChange={(e) => { setSelectedSubcategory(e.target.value); setSelectedAnimation(''); }}>
                    <option value="">Seleccione una subcategoría</option>
                    {Object.keys(categories[selectedCategory]).map((subcategory, index) => (
                        <option key={index} value={subcategory}>{subcategory}</option>
                    ))}
                </select>
            )}

            {selectedSubcategory && (
                <select value={selectedAnimation} onChange={(e) => setSelectedAnimation(e.target.value)}>
                    <option value="">Seleccione una animación</option>
                    {categories[selectedCategory][selectedSubcategory].map((animation, index) => (
                        <option key={index} value={animation}>{animation}</option>
                    ))}
                </select>
            )}
            
            <button onClick={handleAnimation}>Ejecutar Animación</button>
        </div>
    );
};

export default RobotAnimationControl;