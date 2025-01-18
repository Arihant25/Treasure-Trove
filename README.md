# Treasure Trove 🏪

A dedicated Buy-Sell platform exclusively for the IIIT Community, built with the MERN stack.

## 🎯 Features

- Secure authentication with IIIT email validation
- Intuitive item search with category filtering
- Real-time shopping cart management
- Secure transaction system with OTP verification
- Comprehensive order tracking for both buyers and sellers
- User profile management
- Responsive and user-friendly interface

## 🛠️ Tech Stack

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React** - Frontend framework
- **Node.js** - Runtime environment
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/treasure-trove.git
cd treasure-trove
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Create a .env file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend application:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Key Features

### User Authentication
- Email-based registration (IIIT emails only)
- Secure login with JWT
- Persistent sessions
- Protected routes

### Marketplace
- Advanced search functionality
- Category-based filtering
- Detailed item pages
- Shopping cart management

### Order Management
- OTP-based transaction verification
- Order history tracking
- Separate views for bought and sold items
- Real-time order status updates

### Profile Management
- User profile customization
- Contact information management
- Order tracking
- Transaction history

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Session management
- Input validation and sanitization

## 📁 Project Structure

```
treasure-trove/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 👥 User Roles

### Buyer
- Browse items
- Add to cart
- Place orders
- View order history
- Provide OTP for transaction completion

### Seller
- List items for sale
- Manage listings
- Process orders
- Verify transactions with OTP

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.

---

This was an assignment for the course _Design and Analysis of Software Systems_ Spring 2025 at IIIT Hyderabad.