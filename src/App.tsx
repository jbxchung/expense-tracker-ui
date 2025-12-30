import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppProvider } from 'contexts/app/AppProvider';

import Header from 'components/Header/Header';
import ProtectedRoutes from 'components/ProtectedRoutes/ProtectedRoutes';

import Auth, { AuthModes } from 'pages/Auth/Auth';
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
              {/* login and signup */}
              <Route path="/login" element={<Auth mode={AuthModes.LOGIN} />} />
              <Route path="/signup" element={<Auth mode={AuthModes.SIGNUP} />} />

              <Route element={<ProtectedRoutes/>}>
                {/* main page */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* managing stuff */}
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/importers" element={<Importers />} />
              </Route>
            </Routes>
          </div>
        </AppProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
