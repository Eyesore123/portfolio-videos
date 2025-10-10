import './index.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Videos from './pages/Videos';
import VideoDetailsPage from './pages/VideoDetailsPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/:id" element={<VideoDetailsPage />}  />
    </Routes>
  )
}

export default App
