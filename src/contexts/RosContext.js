import React, { createContext, useContext, useState, useEffect } from 'react';
import * as ROSLIB from 'roslib';
import { createService, callService } from '../services/RosManager';

//Contexto en React para manejar la conexión a ROS

//RosContext: Crea un contexto de React que contendrá la conexión ROS, permitiendo su acceso desde cualquier componente.
const RosContext = createContext();

// RosProvider: Componente que configura la conexión con ROS y la almacena.
export const RosProvider = ({ children }) => {
    const [ros, setRos] = useState(null);
    const [rosUrl, setRosUrl] = useState('ws://localhost:9090');  // Default to localhost
    const [robotModel, setRobotModel] = useState(null); // Estado para el modelo del robot
    const [posture, setPosture] = useState('Unknown'); // Estado para la postura del robot

    useEffect(() => {
        const userIp = prompt("Please enter the server IP address (default is localhost):", "localhost");
        if (userIp) {
            setRosUrl(`ws://${userIp}:9090`);
        }
    }, []);    

    const connect = (url_param) => {
        const rosInstance = new ROSLIB.Ros({ url: url_param });

        rosInstance.on('connection', () => {
            console.log('Connected to websocket server.');
        });

        rosInstance.on('error', (error) => {
            console.log('Error connecting to websocket server: ', error);
        });

        rosInstance.on('close', () => {
            console.log('Connection to websocket server closed.');
        });

        setRos(rosInstance);
    };

    useEffect(() => {
        connect(rosUrl);
    }, [rosUrl]);

    useEffect(() => {
        if (ros) {
            const robotConfigService = createService(ros, '/naoqi_driver/get_robot_config', 'naoqi_bridge_msgs/srv/GetRobotInfo');
            
            callService(robotConfigService, {}, (result) => {
                if (result.info && result.info.model) {
                    console.log(`Robot model detected: ${result.info.model}`);
                    if (result.info.model.toLowerCase().includes('nao')) {
                        setRobotModel('NAO');
                    } else {
                        setRobotModel('Pepper');
                    }
                }
            });
        }
    }, [ros]);

    return (
        <RosContext.Provider value={{ ros, robotModel, posture, setPosture }}>
            {children}
        </RosContext.Provider>
    );
};

export const useRos = () => {
    return useContext(RosContext);
};
