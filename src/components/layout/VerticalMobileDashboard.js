import React from 'react';
import { useRos } from '../../contexts/RosContext';

// Importación de todos los componentes de funcionalidades
import CameraFeed from '../features/perception/CameraFeed';
import MicrophoneFeed from '../features/speech/MicrophoneFeed';
import JoystickControl from '../features/mobile/JoystickControl';
import StateControl from '../features/mobile/StateControl';
import RobotActions from '../features/mobile/RobotActions';
import VolumeControl from '../features/speech/VolumeControl';
const VerticalMobileDashboard = () => { // Nombre del componente actualizado
    const { robotModel } = useRos();

    return (
        <div className="p-4 sm:p-6">
            <MicrophoneFeed /> {/* Componente sin UI visible, solo para recibir audio */}
            <div className="flex flex-wrap justify-center gap-6">
                {/* Cada componente se renderiza dentro de una tarjeta con estilos de Tailwind */}
                <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col"><CameraFeed /></div>
                <StateControl />
                <RobotActions /> {/* Añadir el nuevo componente de acciones */}
                <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col"><VolumeControl /></div>
                
                {/* Tarjeta "anclada" para el JoystickControl */}
                <div className="w-full bg-white rounded-lg shadow-lg p-4 flex justify-center items-center">
                    <JoystickControl speed={0.5} />
                </div>
            </div>
        </div>
    );
};

export default VerticalMobileDashboard; // Export actualizado