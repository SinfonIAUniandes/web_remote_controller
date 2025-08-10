import React, { useEffect, useRef } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, subscribeToTopic } from '../../../services/RosManager';

const CameraFeed = () => {
    const { ros } = useRos();
    const frontCameraRef = useRef(null);
    const bottomCameraRef = useRef(null);

    useEffect(() => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }

        // 1. Crear tópicos con los nuevos nombres de naoqi_driver2
        const frontCameraTopic = createTopic(ros, 'naoqi_driver/camera/front/image_raw/compressed', 'sensor_msgs/msg/CompressedImage');
        const bottomCameraTopic = createTopic(ros, 'naoqi_driver/camera/bottom/image_raw/compressed', 'sensor_msgs/msg/CompressedImage');

        // 2. Suscribirse a la cámara frontal y actualizar la imagen
        const frontSub = subscribeToTopic(frontCameraTopic, (message) => {
            if (frontCameraRef.current) {
                frontCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            }
        });

        // 3. Suscribirse a la cámara inferior y actualizar la imagen
        const bottomSub = subscribeToTopic(bottomCameraTopic, (message) => {
            if (bottomCameraRef.current) {
                bottomCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            }
        });

        // 4. La llamada al servicio para habilitar las cámaras ya no es necesaria.

        // Limpiar las suscripciones al desmontar el componente
        return () => {
            frontCameraTopic.unsubscribe();
            bottomCameraTopic.unsubscribe();
            console.log('Suscripciones a tópicos de cámara canceladas.');
        };
        
    }, [ros]);

    return (
        <div>
            <h3>Cámaras del Robot</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                <div>
                    <h4>Cámara Frontal</h4>
                    <img 
                        id="front_camera" 
                        ref={frontCameraRef} 
                        alt="Cámara Frontal" 
                        style={{ width: '320px', height: '240px', border: '1px solid black' }} 
                    />
                </div>
                <div>
                    <h4>Cámara Inferior</h4>
                    <img 
                        id="bottom_camera" 
                        ref={bottomCameraRef} 
                        alt="Cámara Inferior" 
                        style={{ width: '320px', height: '240px', border: '1px solid black' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CameraFeed;
