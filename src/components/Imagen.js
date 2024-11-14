// src/components/ServicioImagen.js
import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';

const ServicioImagen = () => {
    const { ros } = useRos();
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);

    // Maneja el cambio de URL en el input
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        setFile(null); // Limpiamos el archivo si el usuario ingresa una URL
    };

    // Maneja la selección de un archivo, convierte a base64 y actualiza el campo de URL
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setUrl(''); // Limpiamos la URL temporalmente

        if (selectedFile) {
            try {
                const base64Data = await convertFileToBase64(selectedFile);
                setUrl(base64Data); // Actualiza el campo URL con la URI base64
            } catch (error) {
                console.error('Error converting file to base64:', error);
            }
        }
    };

    // Convierte un archivo a base64 con el prefijo adecuado
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Retorna la cadena completa en base64 con prefijo
            reader.onerror = (error) => reject(error);
        });
    };

    // Función para enviar la imagen a la tablet
    const sendImageToTablet = async () => {
        if (!ros) {
            console.error('ROS is not connected');
            return;
        }

        const showImageService = createService(ros, '/pytoolkit/ALTabletService/show_image_srv', 'robot_toolkit_msgs/tablet_service_srv');

        const imageData = url; // Usamos directamente el valor de URL (base64 o URL ingresada)

        const request = { url: imageData };

        showImageService.callService(request, (result) => {
            console.log('Image sent to tablet successfully:', result);
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