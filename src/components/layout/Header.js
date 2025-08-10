import React from 'react';
import BatteryStatus from '../features/miscellaneous/BatteryStatus';

const headerStyle = {
    backgroundColor: '#282c34',
    padding: '20px',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const Header = () => {
    return (
        <header style={headerStyle}>
            <h1>Panel de Control del Robot</h1>
            <BatteryStatus />
        </header>
    );
};

export default Header;