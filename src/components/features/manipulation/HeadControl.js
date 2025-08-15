import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

const HeadControl = () => {
    const { ros } = useRos();
    const [pitch, setPitch] = useState(0);
    const [yaw, setYaw] = useState(0);
    const speed = 0.1;
    const STEP = 0.02;
    const MAX = 1.57;

    const headTopic = useRef(null);
    const pressedKeys = useRef(new Set());
    const animationFrameId = useRef(null);
    const lastPublishTime = useRef(0);
    const PUBLISH_INTERVAL = 100;

    useEffect(() => {
        if (ros) {
            headTopic.current = createTopic(ros, '/joint_angles', 'naoqi_bridge_msgs/msg/JointAnglesWithSpeed');
        }
    }, [ros]);

    const publishHead = useCallback((newPitch, newYaw) => {
        if (!headTopic.current) return;

        const message = {
            joint_names: ["HeadYaw", "HeadPitch"],
            joint_angles: [newYaw, newPitch],
            speed: speed,
            relative: 0
        };

        publishMessage(headTopic.current, message);
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

    // Desactivar componente visual
    return null;
};

export default HeadControl;