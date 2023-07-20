import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import MainContainer from './components/MainContainer';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainContainer/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
