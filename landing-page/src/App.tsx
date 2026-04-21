import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Outras rotas de marketing podem entrar aqui */}
    </Routes>
  );
}

export default App;
