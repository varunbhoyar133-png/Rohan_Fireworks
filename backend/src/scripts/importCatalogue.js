import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from './seed.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const runImport = async () => {
  try {
    console.log('\n--- Rohan Fireworks Catalogue Importer ---');
    console.log('Importing 119 verified products from fireworks list/Jianna Fireworks _119_Price_List.pdf...\n');
    await connectDB();
    await seedDatabase();
    console.log('\nCatalogue import completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
};

runImport();
