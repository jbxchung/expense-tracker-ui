import { useState } from 'react';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Header from 'components/Header/Header';

import Dashboard from 'pages/Dashboard/Dashboard';

import './App.scss';
// import Transactions from 'pages/Dashboard/Transactions/Transactions';
import { AppProvider } from 'contexts/app/AppProvider';


function App() {
  return (
  
    <div className="container">
      <BrowserRouter>
        <AppProvider>
          <Header />
          {/* <Settings /> */}

          <div className="main-content">
            <div className="bg" />
            
            <Routes>
              {/* root should redirect to dashboard*/}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* maing page */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/transactions" element={<Transactions />} /> */}
              {/* manage stuff */}
              {/* <Route path="/accounts" element={<Accounts />} /> */}
            </Routes>
          </div>
        </AppProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
