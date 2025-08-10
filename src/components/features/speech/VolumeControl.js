import React, { useEffect, useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const VolumeControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(50); // Estado para el volumen actual

    useEffect(() => {
        if (ros) {
            // Crear el servicio para obtener el volumen actual
            const getVolumeService = createService(ros, '/naoqi_speech/get_volume', 'naoqi_utilities_msgs/srv/GetVolume');

            // Llamar al servicio para obtener el volumen inicial
            callService(getVolumeService, {}, (result) => {
                if (result.success) {
                    setVolume(result.volume); // Actualizar el estado con el volumen actual
                    console.log('Volumen inicial obtenido:', result.volume);
                } else {
                    console.error('Error al obtener el volumen inicial:', result.message);
                }
            });
        }
    }, [ros]);

    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);

        if (ros) {
            // Crear el servicio para establecer el volumen
            const setVolumeService = createService(ros, '/naoqi_speech/set_volume', 'naoqi_utilities_msgs/srv/SetVolume');
            const request = { volume: newVolume };

            // Llamar al servicio para actualizar el volumen
            callService(setVolumeService, request, (result) => {
                if (result.success) {
                    console.log('Volumen actualizado:', newVolume);
                } else {
                    console.error('Error al actualizar el volumen:', result.message);
                }
            });
        }
    };

    const increaseVolume = () => {
        if (volume < 100) {
            handleVolumeChange({ target: { value: volume + 10 } });
        }
    };

    const decreaseVolume = () => {
        if (volume > 0) {
            handleVolumeChange({ target: { value: volume - 10 } });
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Volumen del Robot</h2>
            <div>
                <label>Volumen: {volume}</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                />
                <button onClick={increaseVolume}>Subir Volumen</button>
                <button onClick={decreaseVolume}>Bajar Volumen</button>
            </div>
        </div>
    );
};

export default VolumeControl;