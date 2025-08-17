import React, { useEffect, useRef, useCallback } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

const GamepadControl = ({ speed }) => {
    const { ros } = useRos();
    const cmdVelTopic = useRef(null);
    const animationFrameId = useRef(null);
    const lastMessage = useRef({ linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } });

    // Inicializa el tópico de ROS para la velocidad del robot
    useEffect(() => {
        if (ros) {
            cmdVelTopic.current = createTopic(ros, '/cmd_vel', 'geometry_msgs/msg/Twist');
        }
    }, [ros]);

    // Bucle principal para leer el gamepad y publicar mensajes
    const gameLoop = useCallback(() => {
        const gamepads = navigator.getGamepads();
        if (!gamepads || !gamepads[0]) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
            return;
        }

        const gp = gamepads[0];
        const deadzone = 0.15;

        // Mapeo de ejes
        let linearX = Math.abs(gp.axes[1]) > deadzone ? -gp.axes[1] : 0;
        let linearY = Math.abs(gp.axes[0]) > deadzone ? -gp.axes[0] : 0;
        let angularZ = Math.abs(gp.axes[2]) > deadzone ? -gp.axes[2] : 0;

        let message = {
            linear: { x: linearX * speed, y: linearY * speed, z: 0 },
            angular: { x: 0, y: 0, z: angularZ * speed }
        };

        // Medida de seguridad: si la velocidad es muy baja, la consideramos cero.
        const isEffectivelyZero = Math.abs(message.linear.x) < 0.01 &&
                                  Math.abs(message.linear.y) < 0.01 &&
                                  Math.abs(message.angular.z) < 0.01;

        if (isEffectivelyZero) {
            message = { linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } };
        }

        // Solo publicar si el mensaje ha cambiado
        const hasChanged = message.linear.x !== lastMessage.current.linear.x ||
                           message.linear.y !== lastMessage.current.linear.y ||
                           message.angular.z !== lastMessage.current.angular.z;

        if (cmdVelTopic.current && hasChanged) {
            publishMessage(cmdVelTopic.current, message);
            lastMessage.current = message; // Guardar el último mensaje enviado
            console.log(`Velocidades publicadas: x=${message.linear.x.toFixed(2)}, y=${message.linear.y.toFixed(2)}, angular=${message.angular.z.toFixed(2)}`);
        }

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [speed, ros]);

    // Detiene el bucle y el movimiento del robot
    const stopLoop = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        
        const stopMessage = { linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } };
        const wasStopped = lastMessage.current.linear.x === 0 &&
                           lastMessage.current.linear.y === 0 &&
                           lastMessage.current.angular.z === 0;

        if (cmdVelTopic.current && !wasStopped) {
            publishMessage(cmdVelTopic.current, stopMessage);
            lastMessage.current = stopMessage;
            console.log(`Velocidades detenidas: x=0.00, y=0.00, angular=0.00`);
        }
    }, [ros]);

    // Manejadores de eventos para la conexión y desconexión del gamepad
    useEffect(() => {
        const handleGamepadConnected = (event) => {
            console.log('Gamepad conectado:', event.gamepad.id);
            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        const handleGamepadDisconnected = () => {
            console.log('Gamepad desconectado.');
            stopLoop();
        };

        window.addEventListener('gamepadconnected', handleGamepadConnected);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

        // Comprobar si ya hay un gamepad conectado al cargar
        const gamepads = navigator.getGamepads();
        if (gamepads && gamepads[0]) {
            handleGamepadConnected({ gamepad: gamepads[0] });
        }

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnected);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
            stopLoop();
        };
    }, [gameLoop, stopLoop]);

    return null; // No se renderiza ningún elemento visual
};

export default GamepadControl;