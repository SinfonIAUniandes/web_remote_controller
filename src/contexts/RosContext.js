import React, { createContext, useContext, useState, useEffect } from 'react';
import * as ROSLIB from 'roslib';
import { createService, callService } from '../services/RosManager';

//Contexto en React para manejar la conexión a ROS

//RosContext: Crea un contexto de React que contendrá la conexión ROS, permitiendo su acceso desde cualquier componente.
const RosContext = createContext();

export const RosProvider = ({ children }) => {
    const [ros, setRos] = useState(null);
    const [rosUrl, setRosUrl] = useState('ws://localhost:9090');
    const [robotModel, setRobotModel] = useState(null);
    const [posture, setPosture] = useState('Unknown');
    const [isMobile, setIsMobile] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false); // Nuevo estado para orientación

    // Detección robusta de dispositivo móvil
    useEffect(() => {
        const detectMobile = () => {
            // La forma más fiable es buscar patrones de SO móvil en el User Agent.
            const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Como segunda comprobación, consideramos los dispositivos táctiles con pantallas más pequeñas.
            // Esto evita que los portátiles con pantalla táctil se clasifiquen como móviles.
            const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            const isSmallScreen = window.innerWidth < 1024; // Usamos un umbral más grande para incluir tabletas.

            // Se considera móvil si el User Agent lo indica, o si es un dispositivo táctil con pantalla pequeña.
            return isMobileUA || (hasTouch && isSmallScreen);
        };

        const applyDetection = () => {
            setIsMobile(detectMobile());
        };

        applyDetection();

        // Re-evaluar solo en cambios de orientación o al redimensionar la ventana.
        window.addEventListener('resize', applyDetection);
        window.addEventListener('orientationchange', applyDetection);

        return () => {
            window.removeEventListener('resize', applyDetection);
            window.removeEventListener('orientationchange', applyDetection);
        };
    }, []);

    // Nuevo useEffect para detectar la orientación
    useEffect(() => {
        const checkOrientation = () => {
            // Compara el ancho y alto para determinar la orientación
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    useEffect(() => {
        const userIp = prompt("Por favor, ingresa la dirección IP del servidor (por defecto es localhost):", "localhost");
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
        <RosContext.Provider value={{ ros, robotModel, posture, setPosture, isMobile, isLandscape }}>
            {children}
        </RosContext.Provider>
    );
};

export const useRos = () => {
    return useContext(RosContext);
};
