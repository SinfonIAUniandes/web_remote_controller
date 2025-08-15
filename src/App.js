// src/App.js
import React from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';

const App = () => {
    return (
        <div className="App bg-slate-100 min-h-screen">
            <Header />
            <Dashboard />
        </div>
    );
};

export default App;
