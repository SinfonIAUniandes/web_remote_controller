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
        setFile(null);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setUrl('');
    };

    // Modificada para incluir el prefijo base64 completo
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Incluye el prefijo
            reader.onerror = (error) => reject(error);
        });
    };

    const sendImageToTablet = async () => {
        if (!ros) {
            console.error('ROS is not connected');
            return;
        }

        const showImageService = createService(ros, '/pytoolkit/ALTabletService/show_web_view_srv', 'robot_toolkit_msgs/tablet_service_srv');

        let imageData = url;

        if (file) {
            try {
                // Convertir el archivo a base64 con el prefijo de tipo
                imageData = await convertFileToBase64(file);
            } catch (error) {
                console.error('Error converting file to base64:', error);
                return;
            }
        }

        const request = { url: imageData };

        showImageService.callService(request, (result) => {
            console.log('Image sent to tablet successfully:', result);
        }, (error) => {
            console.error('Error calling service:', error);
        });
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h2>Servicio para Enviar Imagen a la Tablet del Robot</h2>
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="Ingresa la URL de la imagen"
                style={{ width: '60%', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
            />
            <p>O</p>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
            />
            <button onClick={sendImageToTablet} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
                Enviar Imagen a la Tablet
            </button>
        </div>
    );
};

export default ServicioImagen;