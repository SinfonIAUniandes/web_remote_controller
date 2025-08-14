import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

const BaseControl = () => {
    const { ros } = useRos();
    const [speed, setSpeed] = useState(0.3); // Estado para la velocidad ajustable
    const pressedKeys = useRef(new Set());
    const cmdVelTopic = useRef(null);

    useEffect(() => {
        if (!ros) {
            console.error("La conexión con ROS no está disponible.");
            return;
        }
        // Crear el tópico una sola vez
        cmdVelTopic.current = createTopic(ros, '/cmd_vel', 'geometry_msgs/msg/Twist');

        // Función de limpieza para detener el robot si el componente se desmonta
        return () => {
            if (cmdVelTopic.current) {
                const stopMessage = {
                    linear: { x: 0, y: 0, z: 0 },
                    angular: { x: 0, y: 0, z: 0 }
                };
                publishMessage(cmdVelTopic.current, stopMessage);
            }
        };
    }, [ros]);

    const updateMovement = useCallback(() => {
        if (!cmdVelTopic.current) return;

        const message = {
            linear: { x: 0, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: 0 }
        };

        const keys = {
            A: 65, // Izquierda
            D: 68, // Derecha
            W: 87, // Adelante
            S: 83, // Atrás
            E: 69, // Rotar derecha
            Q: 81  // Rotar izquierda
        };

        if (pressedKeys.current.has(keys.W)) message.linear.x = speed;
        if (pressedKeys.current.has(keys.S)) message.linear.x = -speed;
        if (pressedKeys.current.has(keys.A)) message.linear.y = speed;
        if (pressedKeys.current.has(keys.D)) message.linear.y = -speed;
        if (pressedKeys.current.has(keys.Q)) message.angular.z = speed;
        if (pressedKeys.current.has(keys.E)) message.angular.z = -speed;

        publishMessage(cmdVelTopic.current, message);
        console.log(`Mensaje publicado:`, message);

    }, [speed]);

    const handleKeyDown = useCallback((event) => {
        const bannedHTMLElements = ["input", "textarea"];
        if (bannedHTMLElements.includes(event.target.localName) || event.repeat) return;

        pressedKeys.current.add(event.keyCode);
        updateMovement();
    }, [updateMovement]);

    const handleKeyUp = useCallback((event) => {
        const bannedHTMLElements = ["input", "textarea"];
        if (bannedHTMLElements.includes(event.target.localName)) return;

        pressedKeys.current.delete(event.keyCode);
        updateMovement();
    }, [updateMovement]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown, false);
        window.addEventListener("keyup", handleKeyUp, false);

        return () => {
            window.removeEventListener("keydown", handleKeyDown, false);
            window.removeEventListener("keyup", handleKeyUp, false);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
            <label htmlFor="speed-slider">Velocidad: {speed.toFixed(2)}</label>
            <input
                id="speed-slider"
                type="range"
                min="0"
                max="0.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default BaseControl;