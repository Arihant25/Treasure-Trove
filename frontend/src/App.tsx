import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from "./components/LandingPage";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UserProfile from './components/UserProfilePage';
import SearchPage from './components/SearchPage';
import SellPage from './components/SellPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage';
import DeliverItemsPage from './components/DeliverItemsPage';
import OrdersPage from './components/OrdersPage';
import SupportPage from './components/SupportPage';

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
        <Route path="/search" element={<SearchPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/items/:id" element={<ItemPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/deliver" element={<DeliverItemsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
