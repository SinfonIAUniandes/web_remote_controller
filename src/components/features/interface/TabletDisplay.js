import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const TabletDisplay = () => {
    const { ros } = useRos();
    const [url, setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');
    const [topic, setTopic] = useState('/camera/front/image_raw');

    // Función genérica para llamar a un servicio
    const handleServiceCall = (serviceName, serviceType, request, successMessage, errorMessage) => {
        if (!ros) {
            alert("La conexión con ROS no está disponible.");
            return;
        }

        const service = createService(ros, `/naoqi_interface_node/${serviceName}`, serviceType);

        callService(service, request, (result) => {
            if (result.success) {
                console.log(`${successMessage}:`, result.message);
            } else {
                console.error(`${errorMessage}:`, result.message);
            }
        });
    };

    // --- Manejadores de eventos para cada funcionalidad ---

    const showWebView = () => handleServiceCall('show_webview', 'naoqi_utilities_msgs/srv/SendURL', { url }, 'URL enviada a la tablet', 'Error al enviar URL');
    const playVideo = () => handleServiceCall('play_video', 'naoqi_utilities_msgs/srv/SendURL', { url: videoUrl }, 'Video enviado a la tablet', 'Error al reproducir video');
    const showImageFromUrl = () => handleServiceCall('show_image', 'naoqi_utilities_msgs/srv/SendURL', { url: imageUrl }, 'Imagen URL enviada', 'Error al enviar imagen URL');
    const showText = () => handleServiceCall('show_text', 'naoqi_utilities_msgs/srv/ShowText', { text, language: 'Spanish' }, 'Texto enviado a la tablet', 'Error al enviar texto');
    const showTopicStream = () => handleServiceCall('show_topic_stream', 'naoqi_utilities_msgs/srv/SendURL', { url: topic }, 'Solicitud de stream enviada', 'Error al mostrar stream');
    const hideTablet = () => handleServiceCall('hide_tablet', 'std_srvs/srv/Trigger', {}, 'Pantalla oculta', 'Error al ocultar pantalla');
    const takeAndShowPicture = () => handleServiceCall('take_and_show_picture', 'std_srvs/srv/Trigger', {}, 'Foto tomada y mostrada', 'Error al tomar foto');
    const toggleAppLauncher = (state) => handleServiceCall('toggle_app_launcher', 'std_srvs/srv/SetBool', { data: state }, 'App Launcher actualizado', 'Error al cambiar App Launcher');

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const base64Data = await convertFileToBase64(file);
            handleServiceCall('show_image', 'naoqi_utilities_msgs/srv/SendURL', { url: base64Data }, 'Imagen desde archivo enviada', 'Error al enviar imagen desde archivo');
        } catch (error) {
            console.error('Error al convertir el archivo a base64:', error);
        }
    };
    
    const sectionStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px'
    };

    const inputStyle = { width: '70%', padding: '8px', marginRight: '10px' };
    const buttonStyle = { padding: '8px 12px' };

    return (
        <div>
            <h3>Control de la Tablet del Robot</h3>

            <div style={sectionStyle}>
                <h4>Mostrar Página Web</h4>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.google.com" style={inputStyle} />
                <button onClick={showWebView} style={buttonStyle}>Mostrar Web</button>
            </div>

            <div style={sectionStyle}>
                <h4>Reproducir Video</h4>
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL del video .mp4" style={inputStyle} />
                <button onClick={playVideo} style={buttonStyle}>Reproducir Video</button>
            </div>

            <div style={sectionStyle}>
                <h4>Mostrar Imagen</h4>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de la imagen" style={inputStyle} />
                <button onClick={showImageFromUrl} style={buttonStyle}>Desde URL</button>
                <p>O subir un archivo:</p>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div style={sectionStyle}>
                <h4>Mostrar Texto en Pantalla</h4>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un texto para el robot" style={inputStyle} />
                <button onClick={showText} style={buttonStyle}>Mostrar Texto</button>
            </div>

            <div style={sectionStyle}>
                <h4>Mostrar Stream de Cámara</h4>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{...inputStyle, width: 'auto'}}>
                    <option value="/camera/front/image_raw">Cámara Frontal</option>
                    <option value="/camera/bottom/image_raw">Cámara Inferior</option>
                </select>
                <button onClick={showTopicStream} style={buttonStyle}>Ver Stream</button>
            </div>

            <div style={sectionStyle}>
                <h4>Controles Generales</h4>
                <button onClick={takeAndShowPicture} style={buttonStyle}>Tomar y Mostrar Foto</button>
                <button onClick={hideTablet} style={{...buttonStyle, marginLeft: '10px'}}>Ocultar Pantalla</button>
                <button onClick={() => toggleAppLauncher(true)} style={{...buttonStyle, marginLeft: '10px'}}>Mostrar App Launcher</button>
                <button onClick={() => toggleAppLauncher(false)} style={{...buttonStyle, marginLeft: '10px'}}>Ocultar App Launcher</button>
            </div>
        </div>
    );
};

export default TabletDisplay;