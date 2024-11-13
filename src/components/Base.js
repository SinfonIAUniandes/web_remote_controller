import React, { useEffect, useCallback } from 'react';
import { useRos } from '../contexts/RosContext'
import * as ROSLIB from 'roslib';

const Base = () => {
    const { ros } = useRos();
    const SPEED = 0.5;
 
    function handleKeyPress(event) {
        if(["input", "textarea"].includes(event.target.localName))
            return;

        var cmdVel = new ROSLIB.Topic({
            ros : ros, 
            name : '/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });

        let message = {
            linear : {
                x : 0,
                y : 0,
                z : 0
            },
            angular : {
                x : 0,
                y : 0,
                z : 0
            }
        };

        if(event.keyCode === 65) { // A
            message.linear.y = SPEED;
        } else if(event.keyCode === 68) { // D
            message.linear.y = -SPEED;
        } else if(event.keyCode === 87) { // W
            message.linear.x = SPEED;
        } else if(event.keyCode === 83) { //S
            message.linear.x = -SPEED;
        }

        if(event.keyCode === 69) { // E
            message.angular.z = -SPEED;
        } else if (event.keyCode === 81) { // Q
            message.angular.z = SPEED;
        }

        var twist = new ROSLIB.Message(message);
        cmdVel.publish(twist);

        console.log(event); // Aquí puedes procesar el evento según lo que necesites
    }

    const cachedHandleKeyPess = useCallback(handleKeyPress, [ros])

    useEffect(() => {
        // Agregar el event listener cuando el componente se monte
        window.addEventListener("keydown", cachedHandleKeyPess, false);

        // Limpiar el event listener cuando el componente se desmonte
        return () => {
            window.removeEventListener("keydown", cachedHandleKeyPess, false);
        };
    }, [cachedHandleKeyPess]); // El arreglo vacío asegura que esto se ejecute solo una vez al montar y desmontar el componente

    return (<></>);
}

export default Base;