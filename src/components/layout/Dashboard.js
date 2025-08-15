import React from 'react';
import { useRos } from '../../contexts/RosContext';

// Importación de todos los componentes de funcionalidades
import AnimationControl from '../features/manipulation/AnimationControl';
import AutonomousLifeControl from '../features/miscellaneous/AutonomousLifeControl';
import BaseControl from '../features/navigation/BaseControl';
import BreathingControl from '../features/manipulation/BreathingControl';
import CameraFeed from '../features/perception/CameraFeed';
import LedControl from '../features/miscellaneous/LedControl';
import MicrophoneFeed from '../features/speech/MicrophoneFeed';
import PostureControl from '../features/manipulation/PostureControl';
import AudioReproductionControl from '../features/speech/AudioReproductionControl';
import SecurityControl from '../features/manipulation/SecurityControl';
import SpeechControl from '../features/speech/SpeechControl';
import TrackerControl from '../features/perception/TrackerControl';
import VolumeControl from '../features/speech/VolumeControl';
import HeadControl from '../features/manipulation/HeadControl';
import TabletDisplay from '../features/interface/TabletDisplay';

const Dashboard = () => {
    const { robotModel } = useRos();

    return (
        <div className="p-4 sm:p-6">
            <BaseControl /> {/* Componente sin UI visible, solo para eventos de teclado */}
            <MicrophoneFeed /> {/* Componente sin UI visible, solo para recibir audio */}
            <HeadControl /> {/* Componente sin UI visible, solo para controlar la cabeza del robot */}
            <div className="flex flex-wrap justify-center gap-6">
                {/* Cada componente se renderiza dentro de una tarjeta con estilos de Tailwind */}
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><CameraFeed /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><SpeechControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><VolumeControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><AudioReproductionControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><PostureControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><AnimationControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><TrackerControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><LedControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><BreathingControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><AutonomousLifeControl /></div>
                <div className="w-full md:w-[calc(50%-1.5rem)] xl:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-lg p-4 flex flex-col"><SecurityControl /></div>
            </div>

            {/* El componente TabletDisplay ahora está fuera de la grilla principal */}
            {robotModel === 'Pepper' && (
                <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                    <TabletDisplay />
                </div>
            )}
        </div>
    );
};

export default Dashboard;