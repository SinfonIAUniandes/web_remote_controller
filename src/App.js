// src/App.js
import React from 'react';
import Cameras from './components/Cameras'
import Base from './components/Base'

const App = () => {

    return (
        <div className="App">
            <h1>Robot camera feed</h1>
            <Cameras/>

            <h1>Robot base</h1>
            <Base />
        </div>
    );
};

export default App;
