import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from "./components/LandingPage";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/profile" element={<UserProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
