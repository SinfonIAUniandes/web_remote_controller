// src/App.js
import React from 'react';
import Cameras from './components/Cameras'
import Leds from './components/Leds'

const App = () => {

    return (
        <div className="App">
            <h1> Robot camera feed </h1> 
            <Cameras/>
            <Leds/>
        </div>
    );
};

export default App;
