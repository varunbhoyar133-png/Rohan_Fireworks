import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

import AdminUser from '../models/AdminUser.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    await connectDB();
    console.log('\n--- Rohan Fireworks Admin Account Creator ---');
    console.log('Secure utility to create or reset the administrator account.\n');

    const name = (await askQuestion('Enter Admin Full Name [Rohan Sharma]: ')) || 'Rohan Sharma';
    const email = (await askQuestion('Enter Admin Email [admin@rohanfireworks.com]: ')) || 'admin@rohanfireworks.com';
    const password = (await askQuestion('Enter Admin Password [Admin@12345]: ')) || 'Admin@12345';

    if (password.length < 6) {
      console.error('Password must be at least 6 characters long.');
      process.exit(1);
    }

    const cleanEmail = email.toLowerCase().trim();
    let admin = await AdminUser.findOne({ email: cleanEmail });

    if (admin) {
      console.log(`\nAdmin account found for "${cleanEmail}". Updating password and name...`);
      admin.name = name.trim();
      admin.password = password; // Will be hashed by pre-save hook
      await admin.save();
      console.log('Password and profile updated successfully!\n');
    } else {
      admin = await AdminUser.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: 'admin',
      });
      console.log(`\nSuccessfully created new Admin: "${admin.name}" (${admin.email})\n`);
    }

    console.log('Credentials Summary:');
    console.log(`- Email: ${cleanEmail}`);
    console.log(`- Login URL: /admin/login`);
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    rl.close();
    process.exit(1);
  }
};

run();
