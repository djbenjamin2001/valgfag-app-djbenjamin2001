import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import PWAPrompt from 'react-ios-pwa-prompt'
import Header from './components/Header';
function App() {

  return (
    <>
   <Header/>
    <main>
        <Outlet/>
    </main>
    <PWAPrompt copyTitle="Føj til hjemmeskærm"/>
    </>
  );
}

export default App;
