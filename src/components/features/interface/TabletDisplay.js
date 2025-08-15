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
    
    const baseInputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const baseButtonClasses = "w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryButtonClasses = `${baseButtonClasses} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`;

    return (
        <div>
            <h3 className="text-lg font-semibold text-center mb-4">Control de la Tablet del Robot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Columna 1 */}
                <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                        <label htmlFor="webview-url" className="block text-sm font-medium text-gray-700">Mostrar Página Web</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input id="webview-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={`${baseInputClasses} flex-grow`} />
                            <button onClick={showWebView} className={`${primaryButtonClasses} w-auto`}>Mostrar</button>
                        </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">Reproducir Video</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input id="video-url" type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL del video .mp4" className={`${baseInputClasses} flex-grow`} />
                            <button onClick={playVideo} className={`${primaryButtonClasses} w-auto`}>Reproducir</button>
                        </div>
                    </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">Mostrar Imagen</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de la imagen" className={`${baseInputClasses} flex-grow`} />
                            <button onClick={showImageFromUrl} className={`${primaryButtonClasses} w-auto`}>Desde URL</button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500">o</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <label htmlFor="text-display" className="block text-sm font-medium text-gray-700">Mostrar Texto</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input id="text-display" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un texto..." className={`${baseInputClasses} flex-grow`} />
                            <button onClick={showText} className={`${primaryButtonClasses} w-auto`}>Mostrar</button>
                        </div>
                    </div>
                </div>

                {/* Columna 3 */}
                <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                        <label htmlFor="camera-stream" className="block text-sm font-medium text-gray-700">Mostrar Stream de Cámara</label>
                        <div className="flex items-center gap-2 mt-1">
                            <select id="camera-stream" value={topic} onChange={(e) => setTopic(e.target.value)} className={`${baseInputClasses} flex-grow`}>
                                <option value="/camera/front/image_raw">Cámara Frontal</option>
                                <option value="/camera/bottom/image_raw">Cámara Inferior</option>
                            </select>
                            <button onClick={showTopicStream} className={`${primaryButtonClasses} w-auto`}>Ver</button>
                        </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                        <h4 className="block text-sm font-medium text-gray-700">Controles Generales</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button onClick={takeAndShowPicture} className={secondaryButtonClasses}>Tomar Foto</button>
                            <button onClick={hideTablet} className={secondaryButtonClasses}>Ocultar Pantalla</button>
                            <button onClick={() => toggleAppLauncher(true)} className={secondaryButtonClasses}>Mostrar Launcher</button>
                            <button onClick={() => toggleAppLauncher(false)} className={secondaryButtonClasses}>Ocultar Launcher</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabletDisplay;