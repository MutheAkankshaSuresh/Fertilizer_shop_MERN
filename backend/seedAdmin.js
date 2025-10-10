const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fertilizers';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ DB Connected');

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', adminEmail);
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Admin created:', adminEmail, 'password: admin123');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
