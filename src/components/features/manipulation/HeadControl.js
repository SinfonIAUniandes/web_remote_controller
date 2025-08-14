import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

const HeadControl = () => {
    const { ros } = useRos();
    const [pitch, setPitch] = useState(0);  // HeadPitch
    const [yaw, setYaw] = useState(0);      // HeadYaw
    const speed = 0.1;
    const STEP = 0.02; // Ajustado para un movimiento más suave en el bucle
    const MAX = 1.57;  // 90 grados en radianes

    const headTopic = useRef(null);
    const pressedKeys = useRef(new Set());
    const animationFrameId = useRef(null);
    const lastPublishTime = useRef(0);
    const PUBLISH_INTERVAL = 100; // Publicar cada 100ms
    const SYNC_THRESHOLD = 0.1; // Umbral para resincronizar con joint_states (en radianes)

    useEffect(() => {
        if (ros) {
            headTopic.current = createTopic(ros, '/joint_angles', 'naoqi_bridge_msgs/msg/JointAnglesWithSpeed');

            const jointStateTopic = createTopic(ros, '/joint_states', 'sensor_msgs/msg/JointState');
            
            const subscriber = (message) => {
                // Solo resincronizar si no hay teclas presionadas para evitar conflictos
                if (pressedKeys.current.size > 0) return;

                const headYawIndex = message.name.indexOf('HeadYaw');
                const headPitchIndex = message.name.indexOf('HeadPitch');

                if (headYawIndex !== -1) {
                    const newYaw = message.position[headYawIndex];
                    setYaw(currentYaw => 
                        Math.abs(newYaw - currentYaw) > SYNC_THRESHOLD ? newYaw : currentYaw
                    );
                }
                if (headPitchIndex !== -1) {
                    const newPitch = message.position[headPitchIndex];
                    setPitch(currentPitch => 
                        Math.abs(newPitch - currentPitch) > SYNC_THRESHOLD ? newPitch : currentPitch
                    );
                }
            };

            jointStateTopic.subscribe(subscriber);

            return () => {
                jointStateTopic.unsubscribe(subscriber);
            };
        }
    }, [ros]);


    const publishHead = useCallback((newPitch, newYaw) => {
        if (!headTopic.current) return;

        const message = {
            joint_names: ["HeadYaw", "HeadPitch"],
            joint_angles: [newYaw, newPitch],
            speed: speed,
            relative: 0 // Usamos 0 para movimiento absoluto
        };

        publishMessage(headTopic.current, message);
        // console.log("Moviendo cabeza a:", message); // Descomentar para depuración
    }, [speed]);

    const clamp = (value) => Math.max(-MAX, Math.min(MAX, value));

    const updateMovement = useCallback(() => {
        if (pressedKeys.current.size > 0) {
            let newPitch = pitch;
            let newYaw = yaw;

            if (pressedKeys.current.has('i')) newPitch = clamp(pitch - STEP);
            if (pressedKeys.current.has('k')) newPitch = clamp(pitch + STEP);
            if (pressedKeys.current.has('j')) newYaw = clamp(yaw + STEP);
            if (pressedKeys.current.has('l')) newYaw = clamp(yaw - STEP);

            // Actualizamos el estado localmente para una respuesta visual inmediata
            setPitch(newPitch);
            setYaw(newYaw);

            const now = Date.now();
            if (now - lastPublishTime.current > PUBLISH_INTERVAL) {
                publishHead(newPitch, newYaw);
                lastPublishTime.current = now;
            }
        }
        animationFrameId.current = requestAnimationFrame(updateMovement);
    }, [pitch, yaw, publishHead]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            const bannedHTMLElements = ["input", "textarea"];
            if (bannedHTMLElements.includes(e.target.localName) || e.repeat) return;
            const key = e.key.toLowerCase();
            if (['i', 'k', 'j', 'l'].includes(key)) {
                pressedKeys.current.add(key);
            }
        };

        const handleKeyUp = (e) => {
            pressedKeys.current.delete(e.key.toLowerCase());
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        animationFrameId.current = requestAnimationFrame(updateMovement);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [updateMovement]);


    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>🎮 Mover Cabeza con Teclado</h2>
            <p><strong>I</strong> = arriba | <strong>K</strong> = abajo | <strong>J</strong> = izquierda | <strong>L</strong> = derecha</p>
            <p>Pitch: {pitch.toFixed(2)} rad | Yaw: {yaw.toFixed(2)} rad</p>
        </div>
    );
};

export default HeadControl;