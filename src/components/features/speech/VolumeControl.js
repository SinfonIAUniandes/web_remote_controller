import React, { useEffect, useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const VolumeControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(50); // Estado para el volumen actual

    useEffect(() => {
        if (ros) {
            // Crear el servicio para obtener el volumen actual
            const getVolumeService = createService(ros, '/naoqi_speech_node/get_volume', 'naoqi_utilities_msgs/srv/GetVolume');

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
            const setVolumeService = createService(ros, '/naoqi_speech_node/set_volume', 'naoqi_utilities_msgs/srv/SetVolume');
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
        <div className="text-center flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Control de Volumen</h2>
            <div className="flex-grow flex flex-col items-center justify-center">
                <label className="text-lg font-medium text-gray-700 mb-2">Volumen: {volume}%</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-center gap-4 mt-4">
                    <button 
                        onClick={decreaseVolume}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        -
                    </button>
                    <button 
                        onClick={increaseVolume}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VolumeControl;