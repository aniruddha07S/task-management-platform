const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    const accounts = [
      { name: 'Test User', email: 'testuser@example.com', password: 'Test@1234', role: 'user' },
      { name: 'Admin User', email: 'admin@example.com', password: 'Admin@1234', role: 'admin' },
    ];

    for (const acc of accounts) {
      const existing = await User.findOne({ email: acc.email });
      if (existing) {
        console.log(`Already exists: ${acc.email}`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      await User.create({ ...acc, password: hashedPassword });
      console.log(`Created: ${acc.email}`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedUsers();
