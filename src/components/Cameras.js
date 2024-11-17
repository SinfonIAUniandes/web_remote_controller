import React, { useEffect, useRef } from 'react';
import { useRos } from '../contexts/RosContext'

//Las funciones para crear topicos y servicios
import { createTopic, createService } from '../services/RosManager';

const Cameras = () => {
    const { ros } = useRos()
    const frontCameraRef = useRef(null);
    const bottomCameraRef = useRef(null);

    useEffect(() => {
        if (ros) {
            // Create topics for front and bottom cameras
            const frontCameraListener = createTopic(ros, '/robot_toolkit_node/camera/front/image_raw/compressed', 'sensor_msgs/CompressedImage');
            const bottomCameraListener = createTopic(ros, '/robot_toolkit_node/camera/bottom/image_raw/compressed', 'sensor_msgs/CompressedImage');

            // Subscribe to front camera
            frontCameraListener.subscribe((message) => {
                frontCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            });

            // Subscribe to bottom camera
            bottomCameraListener.subscribe((message) => {
                bottomCameraRef.current.src = "data:image/jpeg;base64," + message.data;
            });

            // Create service for enabling vision tools
            const enableVisionService = createService(ros, '/robot_toolkit/vision_tools_srv', 'robot_toolkit_msgs/vision_tools_msg');

            // Request for front camera
            const frontRequest = {
                data: {
                    camera_name: "front_camera",
                    command: "custom",
                    resolution: 0,
                    frame_rate: 30,
                    color_space: 11
                }
            };

            enableVisionService.callService(frontRequest, (result) => {
                console.log('Front camera vision service called:', result);
            });

            // Request for bottom camera
            const bottomRequest = {
                data: {
                    camera_name: "bottom_camera",
                    command: "custom",
                    resolution: 0,
                    frame_rate: 30,
                    color_space: 11
                }
            };

            enableVisionService.callService(bottomRequest, (result) => {
                console.log('Bottom camera vision service called:', result);
            });

            // Cleanup subscriptions on unmount
            return () => {
                frontCameraListener.unsubscribe();
                bottomCameraListener.unsubscribe();
            };
        }
    }, [ros]);

    return (
        <div>
            <h1>Cameras</h1>
            <div>
                <h2>Front Camera</h2>
                <img id="front_camera" ref={frontCameraRef} alt="Front Camera" />
            </div>
            <div>
                <h2>Bottom Camera</h2>
                <img id="bottom_camera" ref={bottomCameraRef} alt="Bottom Camera" />
            </div>
        </div>
    );
};

export default Cameras;
