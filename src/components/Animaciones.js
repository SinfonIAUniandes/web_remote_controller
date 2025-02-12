import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { startManipulationMessage, sendAnimation } from './manipulationService';
import animations from './animations.json'; // Assuming animations are stored as JSON

const AnimationView = () => {
    const { ros } = useRos();
    const [animationPublisher, setAnimationPublisher] = useState(null);
    const [selectedAnimation, setSelectedAnimation] = useState('');

    useEffect(() => {
        if (ros) {
            const publisher = startManipulationMessage(ros);
            setAnimationPublisher(publisher);
        }
    }, [ros]);

    const handleAnimation = () => {
        if (!selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }
        sendAnimation(animationPublisher, selectedAnimation);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Animaciones</h2>
            <select value={selectedAnimation} onChange={(e) => setSelectedAnimation(e.target.value)}>
                <option value="">Seleccione una animación</option>
                {animations.map((animation, index) => (
                    <option key={index} value={animation}>{animation}</option>
                ))}
            </select>
            <button onClick={handleAnimation}>Ejecutar Animación</button>
        </div>
    );
};

export default AnimationView;
