import React, { useRef, useEffect, useCallback } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';
import joystickBase from '../../../assets/joystick-base.png';
import joystickRed from '../../../assets/joystick-red.png';

const JoystickControl = ({ speed }) => {
    const { ros } = useRos();
    const stickRef = useRef(null);
    const cmdVelTopic = useRef(null);
    const joystickState = useRef({
        active: false,
        dragStart: null,
        touchId: null,
        value: { x: 0, y: 0 }
    });
    const rotationState = useRef(null); // 'left', 'right', or null
    const animationFrameId = useRef(null);

    const maxDistance = 24; // Reducido para coincidir con el nuevo tamaño visual
    const deadzone = 12;

    useEffect(() => {
        if (ros) {
            cmdVelTopic.current = createTopic(ros, '/cmd_vel', 'geometry_msgs/msg/Twist');
        }
    }, [ros]);

    const publishMovement = useCallback(() => {
        if (!cmdVelTopic.current) return;

        const message = {
            linear: { x: 0, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: 0 }
        };

        if (joystickState.current.active) {
            const { x, y } = joystickState.current.value;
            message.linear.x = -y * speed;
            message.linear.y = -x * speed;
        }

        if (rotationState.current === 'left') {
            message.angular.z = speed;
        } else if (rotationState.current === 'right') {
            message.angular.z = -speed;
        }

        publishMessage(cmdVelTopic.current, message);
    }, [speed, ros]);

    const loop = useCallback(() => {
        publishMovement();
        animationFrameId.current = requestAnimationFrame(loop);
    }, [publishMovement]);

    const stopLoop = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        if (cmdVelTopic.current) {
            const stopMessage = {
                linear: { x: 0, y: 0, z: 0 },
                angular: { x: 0, y: 0, z: 0 }
            };
            publishMessage(cmdVelTopic.current, stopMessage);
        }
    }, [ros]);

    const startLoop = useCallback(() => {
        if (!animationFrameId.current) {
            animationFrameId.current = requestAnimationFrame(loop);
        }
    }, [loop]);

    const handleJoystickDown = useCallback((event) => {
        joystickState.current.active = true;
        stickRef.current.style.transition = '0s';
        event.preventDefault();

        if (event.changedTouches) {
            joystickState.current.dragStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
            joystickState.current.touchId = event.changedTouches[0].identifier;
        } else {
            joystickState.current.dragStart = { x: event.clientX, y: event.clientY };
        }
        startLoop();
    }, [startLoop]);

    const handleJoystickUp = useCallback((event) => {
        if (!joystickState.current.active) return;
        if (event.changedTouches && joystickState.current.touchId !== event.changedTouches[0].identifier) return;

        stickRef.current.style.transition = '.2s';
        stickRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
        
        joystickState.current.value = { x: 0, y: 0 };
        joystickState.current.active = false;
        joystickState.current.touchId = null;

        if (!rotationState.current) {
            stopLoop();
        }
    }, [stopLoop]);

    const handleRotationDown = useCallback((direction) => {
        rotationState.current = direction;
        startLoop();
    }, [startLoop]);

    const handleRotationUp = useCallback(() => {
        rotationState.current = null;
        if (!joystickState.current.active) {
            stopLoop();
        }
    }, [stopLoop]);

    const handleMove = useCallback((event) => {
        if (!joystickState.current.active) return;

        let clientX, clientY;
        if (event.changedTouches) {
            let touch = Array.from(event.changedTouches).find(t => t.identifier === joystickState.current.touchId);
            if (!touch) return;
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const xDiff = clientX - joystickState.current.dragStart.x;
        const yDiff = clientY - joystickState.current.dragStart.y;
        const angle = Math.atan2(yDiff, xDiff);
        const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
        const xPosition = distance * Math.cos(angle);
        const yPosition = distance * Math.sin(angle);

        stickRef.current.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

        const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
        const xPosition2 = distance2 * Math.cos(angle);
        const yPosition2 = distance2 * Math.sin(angle);
        const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
        const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));

        joystickState.current.value = { x: xPercent, y: yPercent };
    }, []);

    useEffect(() => {
        const stick = stickRef.current;
        stick.addEventListener('mousedown', handleJoystickDown);
        stick.addEventListener('touchstart', handleJoystickDown);
        document.addEventListener('mousemove', handleMove, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', handleJoystickUp);
        document.addEventListener('touchend', handleJoystickUp);

        return () => {
            stick.removeEventListener('mousedown', handleJoystickDown);
            stick.removeEventListener('touchstart', handleJoystickDown);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleJoystickUp);
            document.removeEventListener('touchend', handleJoystickUp);
            stopLoop();
        };
    }, [handleJoystickDown, handleJoystickUp, handleMove, stopLoop]);

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onMouseDown={() => handleRotationDown('left')}
                onMouseUp={handleRotationUp}
                onTouchStart={(e) => { e.preventDefault(); handleRotationDown('left'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleRotationUp(); }}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold active:bg-gray-400 select-none"
            >
                ⟲
            </button>
            <div className="relative w-24 h-24 flex items-center justify-center">
                <img src={joystickBase} alt="Joystick Base" className="w-full h-full" />
                <div ref={stickRef} className="absolute w-12 h-12 cursor-pointer">
                    <img src={joystickRed} alt="Joystick Stick" className="w-full h-full" />
                </div>
            </div>
            <button
                onMouseDown={() => handleRotationDown('right')}
                onMouseUp={handleRotationUp}
                onTouchStart={(e) => { e.preventDefault(); handleRotationDown('right'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleRotationUp(); }}
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold active:bg-gray-400 select-none"
            >
                ⟳
            </button>
        </div>
    );
};

export default JoystickControl;