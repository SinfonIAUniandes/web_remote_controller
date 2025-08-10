import React, { useEffect } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, subscribeToTopic } from '../../../services/RosManager';

const MicrophoneFeed = () => {
    const { ros } = useRos();

    // Función para reproducir audio desde el mensaje de ROS
    const playAudioFromROSMessage = (data, frequency) => {
        // Crear el buffer de audio usando la Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // El mensaje contiene múltiples canales, pero para la reproducción simple usamos solo el primero.
        // El número de canales reales está en message.channel_map.length
        const audioBuffer = audioContext.createBuffer(1, data.length, frequency);
        const channelData = audioBuffer.getChannelData(0);

        // Normalizar los datos de int16 a flotante (-1.0 a 1.0)
        for (let i = 0; i < data.length; i++) {
            channelData[i] = data[i] / 32768.0;
        }

        // Crear y reproducir el source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    };

    useEffect(() => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }

        // 1. Crear el tópico para escuchar el audio del micrófono. El nombre y tipo son correctos.
        const microphoneTopic = createTopic(ros, '/mic', 'naoqi_bridge_msgs/msg/AudioBuffer');
        
        // 2. Suscribirse al tópico. La lógica de la callback es correcta.
        subscribeToTopic(microphoneTopic, (message) => {
            // El mensaje contiene los datos de audio y la frecuencia
            if (message.data && message.data.length > 0) {
                playAudioFromROSMessage(message.data, message.frequency);
            }
        });

        // 3. La llamada al servicio 'audio_tools_srv' ya no es necesaria y se ha eliminado.

        // Limpiar la suscripción al desmontar el componente
        return () => {
            microphoneTopic.unsubscribe();
            console.log('Suscripción al tópico del micrófono cancelada.');
        };
    }, [ros]);

    return (
        <div>
            <h3>Escuchando Micrófono del Robot</h3>
            <p>El audio del micrófono se reproducirá automáticamente.</p>
        </div>
    );
};

export default MicrophoneFeed;