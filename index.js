const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); 

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://service-providers-panel.vercel.app' })); 
app.use('/uploads', express.static('uploads'));


// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/holidays', require('./routes/holidayRoutes'));
app.use('/api/worksummaries', require('./routes/worksummaryRoutes'));
app.use('/api/projects',require('./routes/projectRoutes'));
app.use('/api/manageworkoffs',require('./routes/manageworkoffsRoutes'));
app.use('/api/workoffs',require('./routes/workoffsRoutes'));
app.use('/api/login-history', require('./routes/loginHistoryRoutes'));
app.use('/api/servicecharge', require('./routes/servicechargeRoutes') )

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
