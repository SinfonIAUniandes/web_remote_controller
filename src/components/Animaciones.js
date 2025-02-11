import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic, createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';
import animations from '../animations/animations'; // Importamos las animaciones

const AnimationControl = () => {
    const { ros } = useRos();
    const [selectedCategory, setSelectedCategory] = useState('BodyTalk');
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    let animationTopic = null;

    useEffect(() => {
        if (ros) {
            console.log('Conectado a ROS:', ros);
            setIsConnected(true);

            animationTopic = createTopic(ros, '/animations', 'robot_toolkit_msgs/animation_msg');

            const enableAnimationService = createService(ros, '/robot_toolkit/manipulation_service', 'robot_toolkit_msgs/manipulation_service');
            const animationRequest = {
                data: { command: "enable_animation" }
            };

            enableAnimationService.callService(animationRequest, (result) => {
                console.log('Servicio de animación inicializado:', result);
            }, (error) => {
                console.error('Error al inicializar el servicio de animación:', error);
            });
        } else {
            console.warn('No se pudo conectar a ROS');
        }
    }, [ros]);

    const handleAnimation = () => {
        if (!selectedAnimation) {
            alert("Por favor, selecciona una animación para ejecutar.");
            return;
        }

        if (ros && animationTopic) {
            console.log(`Enviando animación: ${selectedAnimation} en la categoría: ${selectedCategory}`);

            const message = new ROSLIB.Message({
                name: selectedAnimation,
                category: selectedCategory
            });

            animationTopic.publish(message);
            console.log('Animación publicada exitosamente:', message);
        } else {
            console.error('Error: No conectado a ROS o el tópico de animación no está disponible.');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Animaciones del Robot</h2>
            <div>
                <label>Categoría:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {Object.keys(animations).map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Animación:</label>
                <select
                    value={selectedAnimation}
                    onChange={(e) => setSelectedAnimation(e.target.value)}
                >
                    <option value="">Selecciona una animación</option>
                    {animations[selectedCategory] &&
                        (Array.isArray(animations[selectedCategory])
                            ? animations[selectedCategory].map((anim) => (
                                  <option key={anim} value={anim}>{anim}</option>
                              ))
                            : Object.values(animations[selectedCategory]).flat().map((anim) => (
                                  <option key={anim} value={anim}>{anim}</option>
                              ))
                        )}
                </select>
            </div>
            <button onClick={handleAnimation} disabled={!isConnected}>Ejecutar Animación</button>
        </div>
    );
};

export default AnimationControl;
