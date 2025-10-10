const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if needed

// Connect to your MongoDB
mongoose.connect('mongodb+srv://fertilizer_user:Fertilizer123!@cluster0.6zecu9u.mongodb.net/fertilizer_shop?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to DB');
  createAdmin();
}).catch(err => console.error(err));

async function createAdmin() {
  try {
    // plain password, model will hash it
    await User.findOneAndUpdate(
      { email: 'admin123@gmail.com' },
      {
        name: 'admin',
        email: 'admin123@gmail.com',
        password: 'admin123', // model hashes automatically
        isAdmin: true
      },
      { upsert: true } // create if not exists
    );

    console.log('Admin user created or updated!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
