import './index.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Videos from './pages/Videos';
import VideoDetailsPage from './pages/VideoDetailsPage';
import About from './pages/About';
import Info from './pages/Info';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/:id" element={<VideoDetailsPage />}  />
      <Route path="/about" element={<About />} />
      <Route path ="/info" element={<Info />} />
    </Routes>
  )
}

export default App
