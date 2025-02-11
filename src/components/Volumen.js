import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(null);  // Estado inicial nulo para saber si ya se ha cargado

    // Obtener el volumen actual al cargar el componente
    useEffect(() => {
        if (ros) {
            const getVolumeService = createService(ros, '/pytoolkit/ALAudioDevice/get_output_volume_srv', 'robot_toolkit_msgs/get_output_volume_srv');

            getVolumeService.callService({}, (result) => {
                if (result && typeof result.volume === 'number') {
                    setVolume(result.volume);  // Establecer el volumen recibido
                    console.log('Volumen inicial obtenido:', result.volume);
                } else {
                    console.error('Respuesta del servicio inválida:', result);
                    setVolume(50);  // Valor por defecto si falla
                }
            }, (error) => {
                console.error('Error al obtener el volumen inicial:', error);
                setVolume(50);  // Valor por defecto en caso de error
            });
        }
    }, [ros]);

    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);

        if (ros) {
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume_srv', 'robot_toolkit_msgs/set_output_volume_srv');
            const request = { volume: newVolume };

            volumeService.callService(request, (result) => {
                console.log('Volumen actualizado:', result);
            }, (error) => {
                console.error('Error al actualizar volumen:', error);
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
            <h2>Control de Audio del Robot</h2>
            <div>
                <label>Volumen: {volume !== null ? volume : 'Cargando...'}</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume !== null ? volume : 50}
                    onChange={handleVolumeChange}
                    disabled={volume === null}
                />
                <button onClick={increaseVolume} disabled={volume === null}>Subir Volumen</button>
                <button onClick={decreaseVolume} disabled={volume === null}>Bajar Volumen</button>
            </div>
        </div>
    );
};

export default RobotAudioControl;