import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import AdminUser from '../models/AdminUser.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import InventoryLog from '../models/InventoryLog.js';
import Enquiry from '../models/Enquiry.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatabase = async () => {
  console.log('[Seed] Seeding database with authentic 119 products from source price list...');

  // 1. Seed or Verify Default Admin
  const adminEmail = 'admin@rohanfireworks.com';
  let admin = await AdminUser.findOne({ email: adminEmail });
  if (!admin) {
    admin = await AdminUser.create({
      name: 'Rohan Sharma',
      email: adminEmail,
      password: 'Admin@12345',
      role: 'admin',
    });
    console.log(`[Seed] Created default admin: ${adminEmail} / Admin@12345`);
  } else {
    console.log(`[Seed] Admin user verified: ${adminEmail}`);
  }

  // 2. Seed Store Settings
  let settings = await Setting.findOne({ key: 'store_settings' });
  if (!settings) {
    settings = await Setting.create({
      key: 'store_settings',
      storeName: 'Rohan Fireworks',
      tagline: 'Celebrate Every Moment with Rohan Fireworks',
      logoText: 'ROHAN FIREWORKS',
      currency: '₹',
      announcementBar: {
        enabled: true,
        badgeText: 'FESTIVE 2026',
        message: '✨ Full 119-Product Festive Catalogue Now Live! 100% Green Certified Fireworks & Instant WhatsApp Quotations.',
        link: '/shop',
      },
      businessInfo: {
        phone: '+91 96999 76114',
        whatsapp: '+91 96999 76114',
        email: 'contact@rohanfireworks.com',
        address: 'Plot 42, Festive Fireworks Market, Sivakasi Main Road, Tamil Nadu - 626123, India',
        businessHours: 'Monday – Sunday: 9:00 AM – 9:00 PM IST (Extended Festive Hours)',
      },
      promoBanner: {
        enabled: true,
        badge: 'FESTIVE CELEBRATIONS 2026',
        title: 'Authentic Festive Fireworks Catalogue & Family Assortments',
        description: 'Explore all 119 authentic firework items including aerial multi-shot cakes, display pipes, traditional anars, chakkars, and child-safe sparklers.',
        buttonText: 'Browse Full Catalogue (119 Items)',
        buttonLink: '/shop',
      },
      policies: {
        safetyPolicy: 'Fireworks must be used strictly under adult supervision in open outdoor spaces. Maintain safe distances and keep water/sand on standby.',
        complianceNotice: 'Rohan Fireworks strictly retails licensed Green Crackers adhering to CSIR-NEERI formulations with verifiable QR barcodes.',
        termsNotice: 'Product inquiries are subject to regional regulatory permissions and stock availability at the time of order confirmation.',
      },
      onlineOrdersEnabled: false,
    });
    console.log('[Seed] Created default store settings');
  }

  // 3. Define the 10 Categories matching the 119 products
  const categoryDefinitions = [
    {
      name: 'Aerial Multi-Shots (Sky Cakes)',
      slug: 'aerial-multi-shots',
      description: 'Continuous sequential multi-shot cake batteries filling the night sky with grand aerial bouquets and crackling willows (12 to 500 shots).',
      image: '/uploads/catalogue/page_1_I52.jpg',
      displayOrder: 1,
    },
    {
      name: 'Aerial Display Pipes & Shells',
      slug: 'aerial-display-pipes',
      description: 'Single and paired display pipes from 1" to 6" delivering high-altitude color stars, brocade crowns, and titanium reports.',
      image: '/uploads/catalogue/page_4_I63.jpg',
      displayOrder: 2,
    },
    {
      name: 'Novelty Fountains & Peacocks',
      slug: 'novelty-fountains',
      description: 'Colorful fan fountains, giant peacock tails, elephant fountains, and crackling multi-stage ground novelties.',
      image: '/uploads/catalogue/page_6_I72.jpg',
      displayOrder: 3,
    },
    {
      name: 'Rockets, Helicopters & Butterflies',
      slug: 'rockets-and-missiles',
      description: 'Whistling sound rockets, multi-sound rockets, spinning helicopters, and dancing butterflies.',
      image: '/uploads/catalogue/page_7_I81.jpg',
      displayOrder: 4,
    },
    {
      name: 'Flower Pots (Anar)',
      slug: 'flower-pots',
      description: 'Ground conical fountains shooting high-reaching showers of sparkling gold, tricolor crystals, and silver fountains.',
      image: '/uploads/catalogue/page_9_I90.jpg',
      displayOrder: 5,
    },
    {
      name: 'Ground Chakkars (Spinning Wheels)',
      slug: 'ground-chakkars',
      description: 'Centrifugal spinning ground wheels creating radiant circular rings of golden and multi-color sparks (4*4 wheel, Deluxe, Special).',
      image: '/uploads/catalogue/page_10_I99.jpg',
      displayOrder: 6,
    },
    {
      name: 'Sound Crackers & Atom Bombs',
      slug: 'sound-crackers',
      description: 'Classic sound crackers including Sutli Bombs, Top Tiger, 555, single crackers, and 3-sound blasts.',
      image: '/uploads/catalogue/page_12_I106.jpg',
      displayOrder: 7,
    },
    {
      name: 'Garlands & Repeating Crackers (Ladi)',
      slug: 'garlands-and-ladi',
      description: 'Continuous repeating festive garlands (1K, 2K, 5K, 10K crackers), 4ft rassi, and loose bijli crackers.',
      image: '/uploads/catalogue/page_15_I121.jpg',
      displayOrder: 8,
    },
    {
      name: 'Sparklers (Phuljhadi)',
      slug: 'sparklers',
      description: 'Handheld celebratory sparklers from 9cm to 100cm giant lengths in electric silver, color, and crackling variations.',
      image: '/uploads/catalogue/page_18_I138.jpg',
      displayOrder: 9,
    },
    {
      name: 'Kids Special & Novelties',
      slug: 'kids-special',
      description: 'Child-friendly, low-sound festive items including Pop Pop snappers, Wonder Throw, magic serpents, ring caps, roll caps, and sky lanterns.',
      image: '/uploads/catalogue/page_20_I148.jpg',
      displayOrder: 10,
    },
  ];

  const categoryMap = {};
  for (const cat of categoryDefinitions) {
    let existingCat = await Category.findOne({ slug: cat.slug });
    if (!existingCat) {
      existingCat = await Category.create(cat);
    } else {
      existingCat.name = cat.name;
      existingCat.description = cat.description;
      existingCat.image = cat.image;
      existingCat.displayOrder = cat.displayOrder;
      await existingCat.save();
    }
    categoryMap[cat.slug] = existingCat._id;
  }
  console.log('[Seed] 10 Categories verified and updated');

  // 4. Load the 119 Extracted Products from JSON
  const cataloguePath = path.join(__dirname, 'fireworks_catalogue_119.json');
  const rawData = fs.readFileSync(cataloguePath, 'utf-8');
  const extractedProducts = jsonParseSafe(rawData);

  console.log(`[Seed] Loaded ${extractedProducts.length} products from fireworks_catalogue_119.json`);

  // Remove any obsolete sample products so the catalogue is 100% authentic to the client price list
  await Product.deleteMany({});
  await InventoryLog.deleteMany({});

  let insertedCount = 0;

  for (const item of extractedProducts) {
    const categoryId = categoryMap[item.category_slug] || categoryMap['kids-special'];

    const images = item.has_image && item.image_url
      ? [item.image_url]
      : ['/placeholder-firework.svg'];

    const newProd = await Product.create({
      name: item.display_name,
      originalName: item.raw_name,
      sku: item.sku,
      category: categoryId,
      description: `Authentic ${item.display_name} (${item.category_name}). Visual effect: ${item.visual_effect}. Sound rating: ${item.sound_level}. Source catalog ref: Page ${item.source_page}.`,
      price: item.price,
      priceNeedsReview: item.price_needs_review,
      originalPrice: item.price > 0 ? Math.round(item.price * 1.25) : null,
      stock: item.stock,
      lowStockThreshold: item.low_stock_threshold || 10,
      images,
      packSize: item.pack_size,
      soundLevel: item.sound_level,
      visualEffect: item.visual_effect,
      safetyDistance: item.safety_distance,
      isGreenCracker: true,
      isFeatured: item.is_featured,
      isVisible: true,
    });

    // Record initial inventory log entry
    if (newProd.stock > 0) {
      await InventoryLog.create({
        product: newProd._id,
        productName: newProd.name,
        sku: newProd.sku,
        previousStock: 0,
        newStock: newProd.stock,
        change: newProd.stock,
        type: 'INCREASE',
        reason: 'Imported from authentic product price list',
        note: `Source page ${item.source_page} - ${item.raw_name}`,
        adjustedBy: 'Rohan Sharma',
      });
    }

    insertedCount++;
  }

  console.log(`[Seed] Successfully imported ${insertedCount} products with inventory audit logs!`);

  // 5. Seed a demo enquiry referencing real products
  const sample1 = await Product.findOne({ sku: 'RF-SHT-01' }); // 500 Shots
  const sample2 = await Product.findOne({ sku: 'RF-SPK-03' }); // Fuljhadi 30cm
  const sample3 = await Product.findOne({ sku: 'RF-ANR-01' }); // Anar Giant Standard

  const enquiryCount = await Enquiry.countDocuments();
  if (enquiryCount === 0 && sample1 && sample2) {
    await Enquiry.create({
      enquiryNumber: 'RF-ENQ-2026-1001',
      customerName: 'Ananya Deshmukh',
      phone: '+91 98451 23456',
      email: 'ananya.deshmukh@example.com',
      city: 'Pune',
      address: 'Kothrud, Pune, Maharashtra',
      items: [
        {
          product: sample1._id,
          name: sample1.name,
          sku: sample1.sku,
          price: sample1.price,
          quantity: 1,
          subtotal: sample1.price * 1,
        },
        {
          product: sample2._id,
          name: sample2.name,
          sku: sample2.sku,
          price: sample2.price,
          quantity: 5,
          subtotal: sample2.price * 5,
        },
        ...(sample3 ? [{
          product: sample3._id,
          name: sample3.name,
          sku: sample3.sku,
          price: sample3.price,
          quantity: 2,
          subtotal: sample3.price * 2,
        }] : [])
      ],
      totalEstimatedValue: (sample1.price * 1) + (sample2.price * 5) + (sample3 ? sample3.price * 2 : 0),
      customerNotes: 'Need confirmation for family Diwali festivities. Please WhatsApp confirmation.',
      status: 'New',
      adminNotes: 'Sample enquiry created for demonstration with imported catalogue items.',
      channel: 'Web Catalogue Enquiry',
    });
    console.log('[Seed] Created sample festive enquiry referencing imported catalogue items.');
  }

  console.log('[Seed] Database initialization complete!');
};

function jsonParseSafe(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('Error parsing catalogue JSON:', e);
    return [];
  }
}

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('[Seed] Done! Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('[Seed] Error seeding database:', err);
      process.exit(1);
    }
  })();
}
