import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ElementDetail from './pages/ElementDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/element/:elementId" element={<ElementDetail />} />
    </Routes>
  );
}

export default App;
