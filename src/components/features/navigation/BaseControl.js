import React, { useEffect, useCallback } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

const BaseControl = () => {
    const { ros } = useRos();
    const SPEED = 0.5;

    useEffect(() => {
        if (!ros) {
            console.error("La conexión con ROS no está disponible.");
            return;
        }
    }, [ros]);

    const handleKeyPress = (event) => {
        const bannedHTMLElements = ["input", "textarea"];
        if (bannedHTMLElements.includes(event.target.localName)) return;

        // Crear el tópico para publicar comandos de velocidad
        const cmdVelTopic = createTopic(ros, '/cmd_vel', 'geometry_msgs/msg/Twist');

        // Mensaje inicial con valores por defecto
        let message = {
            linear: { x: 0, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: 0 }
        };

        const pressedKey = event.keyCode;
        const keys = {
            A: 65, // Izquierda
            D: 68, // Derecha
            W: 87, // Adelante
            S: 83, // Atrás
            E: 69, // Rotar derecha
            Q: 81  // Rotar izquierda
        };

        // Actualizar el mensaje según la tecla presionada
        if (pressedKey === keys.A) {
            message.linear.y = SPEED;
        } else if (pressedKey === keys.D) {
            message.linear.y = -SPEED;
        } else if (pressedKey === keys.W) {
            message.linear.x = SPEED;
        } else if (pressedKey === keys.S) {
            message.linear.x = -SPEED;
        } else if (pressedKey === keys.E) {
            message.angular.z = -SPEED;
        } else if (pressedKey === keys.Q) {
            message.angular.z = SPEED;
        }

        // Publicar el mensaje en el tópico /cmd_vel
        publishMessage(cmdVelTopic, message);
        console.log(`Mensaje publicado:`, message);
    };

    const cachedHandleKeyPress = useCallback(handleKeyPress, [ros]);

    useEffect(() => {
        window.addEventListener("keydown", cachedHandleKeyPress, false);

        return () => {
            window.removeEventListener("keydown", cachedHandleKeyPress, false);
        };
    }, [cachedHandleKeyPress]);

    return (<></>);
};

export default BaseControl;