import React, { useEffect, useCallback } from 'react';
import { useRos } from '../contexts/RosContext'
import * as ROSLIB from 'roslib';

const Base = () => {
    const { ros } = useRos();
    const SPEED = 0.5;
 
    function handleKeyPress(event) {
        const bannedHTMLElements = ["input", "textarea"];
        if(bannedHTMLElements.includes(event.target.localName))
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

        const pressedKey = event.keyCode;
        const keys = {
            A: 65,
            D: 68,
            W: 87,
            S: 83,
            E: 69,
            Q: 81
        };

        if(pressedKey === keys.A) {
            message.linear.y = SPEED;
        } else if(pressedKey === keys.D) {
            message.linear.y = -SPEED;
        } else if(pressedKey === keys.W) {
            message.linear.x = SPEED;
        } else if(pressedKey === keys.S) {
            message.linear.x = -SPEED;
        }

        if(pressedKey === keys.E) {
            message.angular.z = -SPEED;
        } else if (pressedKey === keys.Q) {
            message.angular.z = SPEED;
        }

        var twist = new ROSLIB.Message(message);
        cmdVel.publish(twist);

        // console.log(event);
    }

    const cachedHandleKeyPess = useCallback(handleKeyPress, [ros])

    useEffect(() => {
        window.addEventListener("keydown", cachedHandleKeyPess, false);

        return () => {
            window.removeEventListener("keydown", cachedHandleKeyPess, false);
        };
    }, [cachedHandleKeyPess]);

    return (<></>);
}

export default Base;