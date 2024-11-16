// src/components/ServicioImagen.js
import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';

const ServicioImagen = () => {
    const { ros } = useRos();
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        setFile(null); // Limpiamos el archivo si el usuario ingresa una URL
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            try {
                const base64Data = await convertFileToBase64(selectedFile);
                sendImageToTablet(base64Data); // Envía automáticamente la imagen al robot
            } catch (error) {
                console.error('Error converting file to base64:', error);
            }
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Retorna la cadena completa en base64 con prefijo
            reader.onerror = (error) => reject(error);
        });
    };

    const sendImageToTablet = async (imageData) => {
        if (!ros) {
            console.error('ROS is not connected');
            return;
        }

        // Usamos show_web_view para enviar imágenes cargadas desde archivos
        const showImageService = createService(ros, '/pytoolkit/ALTabletService/show_web_view', 'robot_toolkit_msgs/tablet_service_srv');

        const request = { url: imageData };

        showImageService.callService(request, (result) => {
            console.log('Image sent to tablet successfully:', result);
        }, (error) => {
            console.error('Error calling service:', error);
        });
    };

    const sendUrlToTablet = async () => {
        if (!ros) {
            console.error('ROS is not connected');
            return;
        }

        // Usamos show_image para enviar imágenes desde URLs
        const showImageService = createService(ros, '/pytoolkit/ALTabletService/show_image', 'robot_toolkit_msgs/tablet_service_srv');

        const request = { url };

        showImageService.callService(request, (result) => {
            console.log('URL sent to tablet successfully:', result);
        }, (error) => {
            console.error('Error calling service:', error);
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Servicio para Enviar Imagen a la Tablet del Robot</h2>
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="Ingresa la URL de la imagen"
                style={{ width: '60%', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
            />
            <button onClick={sendUrlToTablet} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
                Enviar URL a la Tablet
            </button>
            <p>O</p>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
            />
        </div>
    );
};

export default ServicioImagen;