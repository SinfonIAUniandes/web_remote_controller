import React, { createContext, useContext, useState, useEffect } from 'react';
import * as ROSLIB from 'roslib';

//Contexto en React para manejar la conexión a ROS

//RosContext: Crea un contexto de React que contendrá la conexión ROS, permitiendo su acceso desde cualquier componente.
const RosContext = createContext();

// RosProvider: Componente que configura la conexión con ROS y la almacena.
export const RosProvider = ({ children }) => {
    const [ros, setRos] = useState(null);
    const [rosUrl, setRosUrl] = useState('ws://localhost:9090');  // Default to localhost

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

    return (
        <RosContext.Provider value={{ ros }}>
            {children}
        </RosContext.Provider>
    );
};

export const useRos = () => {
    return useContext(RosContext);
};
