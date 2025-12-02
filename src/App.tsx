import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppProvider } from 'contexts/app/AppProvider';

import Header from 'components/Header/Header';

import Dashboard from 'pages/Dashboard/Dashboard';
import Accounts from 'pages/Accounts/Accounts';
import Categories from 'pages/Categories/Categories';
import Importers from 'pages/Importers/Importers';

import './App.scss';


function App() {
  return (
  
    <div className="container">
      <BrowserRouter>
        <AppProvider>
          {/* nav links for the routes in Header */}
          <Header />

          <div className="main-content">
            <div className="bg" />
            
            <Routes>
              {/* root should redirect to dashboard*/}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* main page */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* managing stuff */}
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/importers" element={<Importers />} />
            </Routes>
          </div>
        </AppProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
