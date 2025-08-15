import React from 'react';
import BatteryStatus from '../features/miscellaneous/BatteryStatus';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Panel de Control del Robot</h1>
            <BatteryStatus />
        </header>
    );
};

export default Header;