// src/App.js
import React from 'react';
import Cameras from './components/Cameras';
import Servicio from './components/NavegadorServicios';

const App = () => {
    return (
        <div className="App">
            <h1>Robot camera feed</h1>
            <Cameras />
            <h1>Servicio Web</h1>
            <Servicio />
        </div>
    );
};

export default App;