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

        // Crear tópicos para consumir y mostrar imágenes
                const frontCameraRawTopic = createTopic(ros, '/camera/front/image_raw', 'sensor_msgs/msg/Image');
                const frontCameraCompressedTopic = createTopic(ros, '/camera/front/image_raw/compressed', 'sensor_msgs/msg/CompressedImage');
                const bottomCameraRawTopic = createTopic(ros, '/camera/bottom/image_raw', 'sensor_msgs/msg/Image');
                const bottomCameraCompressedTopic = createTopic(ros, '/camera/bottom/image_raw/compressed', 'sensor_msgs/msg/CompressedImage');

        // Suscribirse a los tópicos comprimidos para mostrar las imágenes
        const frontCompressedSub = subscribeToTopic(frontCameraCompressedTopic, (message) => {
            if (frontCameraRef.current) {
                frontCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            }
        });

        const bottomCompressedSub = subscribeToTopic(bottomCameraCompressedTopic, (message) => {
            if (bottomCameraRef.current) {
                bottomCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            }
        });
        
                // Suscribirse a los tópicos sin comprimir para consumirlos (sin mostrar)
                const frontRawSub = subscribeToTopic(frontCameraRawTopic, () => {});
        
                const bottomRawSub = subscribeToTopic(bottomCameraRawTopic, () => {});

        // Limpiar las suscripciones al desmontar el componente
        return () => {
            frontCameraCompressedTopic.unsubscribe();
            bottomCameraCompressedTopic.unsubscribe();
            console.log('Suscripciones a tópicos de cámara canceladas.');
        };
    }, [ros]);

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <h3 className="text-md font-semibold text-center flex-shrink-0">Cámaras del Robot</h3>
            <div className="flex-grow min-h-0 rounded-md overflow-hidden">
                <img 
                    id="front_camera" 
                    ref={frontCameraRef} 
                    alt="Cámara Frontal"
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-grow min-h-0 rounded-md overflow-hidden">
                <img 
                    id="bottom_camera" 
                    ref={bottomCameraRef} 
                    alt="Cámara Inferior"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default CameraFeed;
