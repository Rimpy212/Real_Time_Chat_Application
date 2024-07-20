import './App.css';
import './index.css'
import LoginPage from './pages/LoginPage';
import Room from './pages/Room';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import PrivateRoutes from './Components/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <Router>
      <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage/>}/>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Room />} />
              </Route>
            </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
