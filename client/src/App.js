import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import SearchButton from './components/SearchButton';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchButton/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
