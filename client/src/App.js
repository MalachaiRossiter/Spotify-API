import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import MainContainer from './components/MainContainer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainContainer/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
