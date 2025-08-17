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
            const nav = navigator || {};
            const ua = nav.userAgent || nav.vendor || window.opera || '';

            // 1) userAgentData moderno (cuando está disponible)
            let uaIsMobile = false;
            try {
                if (nav.userAgentData && typeof nav.userAgentData.mobile === 'boolean') {
                    uaIsMobile = nav.userAgentData.mobile;
                } else {
                    uaIsMobile = /\b(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet)\b/i.test(ua);
                }
            } catch (e) {
                uaIsMobile = /\b(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet)\b/i.test(ua);
            }

            // 2) soporte táctil (maxTouchPoints / ontouchstart)
            const hasTouch =
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);

            // 3) pointer coarse (tabletas y móviles suelen ser coarse)
            const pointerCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

            // 4) tamaño de pantalla como factor secundario (no único criterio)
            const minScreen = Math.min(window.screen.width || Infinity, window.screen.height || Infinity);
            const smallScreen = minScreen <= 900; // umbral razonable para tablets/telefonos

            // Regla combinada: UA móvil OR (touch + (pointer coarse OR pantalla pequeña))
            const mobile = uaIsMobile || (hasTouch && (pointerCoarse || smallScreen));

            return mobile;
        };

        const applyDetection = () => {
            try {
                setIsMobile(detectMobile());
            } catch (e) {
                // Fallback conservador
                setIsMobile(window.innerWidth <= 768);
            }
        };

        applyDetection();

        window.addEventListener('resize', applyDetection);
        window.addEventListener('orientationchange', applyDetection);
        // Escuchar un touchstart inicial ayuda a detectar dispositivos táctiles en algunos entornos
        window.addEventListener('touchstart', applyDetection, { passive: true });

        return () => {
            window.removeEventListener('resize', applyDetection);
            window.removeEventListener('orientationchange', applyDetection);
            window.removeEventListener('touchstart', applyDetection);
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
