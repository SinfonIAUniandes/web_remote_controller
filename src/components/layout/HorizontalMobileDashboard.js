import React from 'react';
import CameraFeed from '../features/mobile/MobileCameraFeed';
import JoystickControl from '../features/mobile/JoystickControl';
import StateControl from '../features/mobile/StateControl';
import RobotActions from '../features/mobile/RobotActions';
import MicrophoneFeed from '../features/speech/MicrophoneFeed';

const HorizontalMobileDashboard = () => {
    return (
        <div className="w-screen h-screen bg-slate-200 flex p-2 gap-2 overflow-hidden">
            <MicrophoneFeed />

            {/* Columna Izquierda */}
            <div className="flex flex-col w-1/4 gap-2">
                <div className="flex-shrink-0">
                    <StateControl />
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <JoystickControl speed={0.5} />
                </div>
            </div>

            {/* Columna Central */}
            <div className="flex flex-col w-1/2 gap-2">
                <div className="flex-grow bg-white rounded-lg shadow-lg p-2 min-h-0">
                    <CameraFeed />
                </div>
            </div>

            {/* Columna Derecha */}
            <div className="w-1/4">
                <RobotActions />
            </div>
        </div>
    );
};

export default HorizontalMobileDashboard;