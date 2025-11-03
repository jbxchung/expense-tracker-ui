import { useState } from 'react';

import { BrowserRouter, Router } from 'react-router-dom';
import Header from './components/Header/Header';

import './App.scss';
import Card from './components/Card/Card';

function App() {
  const [count, setCount] = useState(0)

  return (
  
    <div className="container">
      <BrowserRouter>
        <Header />
        {/* <Settings /> */}

        <div className="main-content">
          <div className="bg" />
          <Card title="test header" footer="test footer">
            <span>test content</span>
          </Card>
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
