import { useState } from 'react';

import { BrowserRouter, Router } from 'react-router-dom';

import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';

import './App.scss';


function App() {
  return (
  
    <div className="container">
      <BrowserRouter>
        <Header />
        {/* <Settings /> */}

        <div className="main-content">
          <div className="bg" />
          
          <Dashboard />
          {/* <Routes>
            {
              this.state.pages.map(page => (
                <Route path={page.url} key={page.url} element={<page.component />} />
              ))
            }
          </Routes> */}
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
