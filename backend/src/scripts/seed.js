import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
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
  console.log('[Seed] Seeding database with initial store data...');

  // 1. Seed or Verify Default Admin
  const adminEmail = 'admin@rohanfireworks.com';
  let admin = await AdminUser.findOne({ email: adminEmail });
  if (!admin) {
    admin = await AdminUser.create({
      name: 'Rohan Sharma',
      email: adminEmail,
      password: 'Admin@12345', // Automatically hashed by model pre-save hook
      role: 'admin',
    });
    console.log(`[Seed] Created default admin: ${adminEmail} / Admin@12345`);
  } else {
    console.log(`[Seed] Admin user already exists: ${adminEmail}`);
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
        message: '✨ Direct Factory Festive Collection Now Open! 100% Green Certified Fireworks & Family Assortments. Quick WhatsApp Quotations.',
        link: '/shop',
      },
      businessInfo: {
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        email: 'contact@rohanfireworks.com',
        address: 'Plot 42, Festive Fireworks Market, Sivakasi Main Road, Tamil Nadu - 626123, India',
        businessHours: 'Monday – Sunday: 9:00 AM – 9:00 PM IST (Special Festive Extended Hours)',
      },
      promoBanner: {
        enabled: true,
        badge: 'FESTIVE CELEBRATIONS 2026',
        title: 'Grand Festive Sparkle & Family Assortment Boxes',
        description: 'Handcrafted with approved low-smoke compositions, vibrant color bursts, and stringent safety standards for Diwali and family milestones.',
        buttonText: 'Explore Festive Combos',
        buttonLink: '/shop?category=festive-gift-boxes',
      },
      policies: {
        safetyPolicy: 'Fireworks must be used strictly under adult supervision in open outdoor spaces. Maintain safe distances and keep water/sand on standby.',
        complianceNotice: 'Rohan Fireworks strictly retails licensed Green Crackers adhering to CSIR-NEERI formulations with verifiable QR barcodes.',
        termsNotice: 'Online catalogue orders are processed via quotation inquiry in strict accordance with local municipal guidelines.',
      },
      onlineOrdersEnabled: false,
    });
    console.log('[Seed] Created default store settings');
  }

  // 3. Seed Categories
  const categoryData = [
    {
      name: 'Sparklers (Phuljhadi)',
      slug: 'sparklers',
      description: 'Handheld celebratory sparklers with dazzling golden, electric silver, and multi-color crackles.',
      image: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=700&auto=format&fit=crop&q=80',
      displayOrder: 1,
    },
    {
      name: 'Flower Pots (Anar)',
      slug: 'flower-pots',
      description: 'Ground conical fountains shooting high-reaching showers of sparkling gold, tricolor crystals, and silver fountains.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80',
      displayOrder: 2,
    },
    {
      name: 'Ground Chakkars',
      slug: 'ground-chakkars',
      description: 'High-speed spinning ground wheels creating radiant circular rings of golden and multi-color sparks.',
      image: 'https://images.unsplash.com/photo-1533230303862-b92476b91dbf?w=700&auto=format&fit=crop&q=80',
      displayOrder: 3,
    },
    {
      name: 'Sky Rockets',
      slug: 'sky-rockets',
      description: 'Ascending rockets with whistling trails culminating in spectacular multi-color starbursts.',
      image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=700&auto=format&fit=crop&q=80',
      displayOrder: 4,
    },
    {
      name: 'Aerial Repeaters (Sky Shots)',
      slug: 'aerial-repeaters',
      description: 'Continuous multi-shot cake batteries filling the night sky with grand aerial bouquets and crackling willows.',
      image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?w=700&auto=format&fit=crop&q=80',
      displayOrder: 5,
    },
    {
      name: 'Festive Gift Boxes',
      slug: 'festive-gift-boxes',
      description: 'Curated complete family celebration hampers with an assortment of sparklers, anars, chakkars, and novelties.',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80',
      displayOrder: 6,
    },
    {
      name: 'Kids Special Novelties',
      slug: 'kids-special',
      description: 'Safe, low-decibel, high-delight novelties including magic snakes, pop snappers, and color smoke.',
      image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=700&auto=format&fit=crop&q=80',
      displayOrder: 7,
    },
  ];

  const categoryMap = {};
  for (const cat of categoryData) {
    let existingCat = await Category.findOne({ slug: cat.slug });
    if (!existingCat) {
      existingCat = await Category.create(cat);
    }
    categoryMap[cat.slug] = existingCat._id;
  }
  console.log('[Seed] Categories seeded/verified');

  // 4. Seed Products
  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    const productsData = [
      // Sparklers
      {
        name: 'Deluxe Electric Sparklers 15cm',
        sku: 'RF-SPK-01',
        category: categoryMap['sparklers'],
        description: 'Classic electric silver sparklers with intense crackling discharge and low smoke composition. Ideal for family celebrations.',
        price: 120,
        originalPrice: 150,
        stock: 150,
        lowStockThreshold: 20,
        packSize: 'Box of 10 Pieces',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Glittering Electric Silver Shower',
        safetyDistance: '2 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Royal Color Sparklers 30cm (Giant)',
        sku: 'RF-SPK-02',
        category: categoryMap['sparklers'],
        description: 'Long-duration 30cm sparklers burning with vibrant red, emerald green, and golden flares. Long burn time over 90 seconds.',
        price: 240,
        originalPrice: 290,
        stock: 85,
        lowStockThreshold: 15,
        packSize: 'Box of 10 Long Sticks',
        soundLevel: 'Soundless',
        visualEffect: 'Vivid Tricolor Embers & Sparks',
        safetyDistance: '3 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Crackling Gold Sparklers 50cm (Mega)',
        sku: 'RF-SPK-03',
        category: categoryMap['sparklers'],
        description: 'Extra long 50cm festive sparklers with deep golden crackling discharge. Safe wooden handles for comfortable grip.',
        price: 420,
        originalPrice: 490,
        stock: 45,
        lowStockThreshold: 10,
        packSize: 'Box of 5 Mega Sticks',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Continuous Golden Cascade',
        safetyDistance: '4 Meters',
        isGreenCracker: true,
        isFeatured: false,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=700&auto=format&fit=crop&q=80'],
      },

      // Flower Pots (Anar)
      {
        name: 'Special Tri-Color Anar (Fountain)',
        sku: 'RF-ANR-01',
        category: categoryMap['flower-pots'],
        description: 'Signature ground flower pot that erupts in three sequential stages: deep ruby red, emerald green, and a giant silver glitter crown.',
        price: 280,
        originalPrice: 350,
        stock: 60,
        lowStockThreshold: 12,
        packSize: 'Box of 5 Pots',
        soundLevel: 'Low / Sparkle Only',
        visualEffect: '15ft Tri-Color Fountain Eruption',
        safetyDistance: '5 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Giant Golden Crown Anar (Mega Size)',
        sku: 'RF-ANR-02',
        category: categoryMap['flower-pots'],
        description: 'Heavyweight flower pot delivering a massive 20-foot shower of brocade gold sparkles with soothing golden whistle.',
        price: 450,
        originalPrice: 550,
        stock: 8, // Low stock demo!
        lowStockThreshold: 10,
        packSize: 'Box of 2 Giant Pots',
        soundLevel: 'Low / Sparkle Only',
        visualEffect: '20ft Golden Brocade Dome',
        safetyDistance: '6 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80'],
      },

      // Ground Chakkars
      {
        name: 'Deluxe Special Chakkar (Spinning Wheel)',
        sku: 'RF-CHK-01',
        category: categoryMap['ground-chakkars'],
        description: 'Spins smoothly on flat ground with rapid centrifugal golden fire rings and crackling perimeter sparks.',
        price: 180,
        originalPrice: 220,
        stock: 120,
        lowStockThreshold: 20,
        packSize: 'Box of 10 Pieces',
        soundLevel: 'Low / Sparkle Only',
        visualEffect: 'High-Speed Golden Halo Wheel',
        safetyDistance: '4 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1533230303862-b92476b91dbf?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Whistling Butterfly Chakkar',
        sku: 'RF-CHK-02',
        category: categoryMap['ground-chakkars'],
        description: 'Unique two-stage ground spinner that creates a distinct whistling audio note before blossoming into purple and green rings.',
        price: 260,
        originalPrice: 320,
        stock: 40,
        lowStockThreshold: 10,
        packSize: 'Box of 5 Pieces',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Color Spinning Starburst',
        safetyDistance: '5 Meters',
        isGreenCracker: true,
        isFeatured: false,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1533230303862-b92476b91dbf?w=700&auto=format&fit=crop&q=80'],
      },

      // Sky Rockets
      {
        name: 'Sonic Whistling Sky Rocket',
        sku: 'RF-RCK-01',
        category: categoryMap['sky-rockets'],
        description: 'High-altitude precision rocket with a sharp auditory whistle climbing to 100 feet, bursting into golden willow streamers.',
        price: 360,
        originalPrice: 420,
        stock: 35,
        lowStockThreshold: 10,
        packSize: 'Pack of 10 Rockets',
        soundLevel: 'Medium Boom',
        visualEffect: 'Ascending Tail & Gold Willow Burst',
        safetyDistance: '15 Meters in Open Ground',
        isGreenCracker: true,
        isFeatured: false,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Royal Parachute Star Rocket',
        sku: 'RF-RCK-02',
        category: categoryMap['sky-rockets'],
        description: 'Launches a glowing illuminated flare that floats gently downward under a miniature heat-resistant festive parachute.',
        price: 520,
        originalPrice: 650,
        stock: 22,
        lowStockThreshold: 8,
        packSize: 'Pack of 5 Rockets',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Illuminated Floating Parachute Flare',
        safetyDistance: '20 Meters in Open Ground',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=700&auto=format&fit=crop&q=80'],
      },

      // Aerial Repeaters (Sky Shots)
      {
        name: 'Sky Magic 12 Multi-Shots Repeater',
        sku: 'RF-AER-01',
        category: categoryMap['aerial-repeaters'],
        description: 'Compact 12-shot aerial cake that fires in sequential succession with red peonies, green glittering dahlias, and crackling brocade.',
        price: 850,
        originalPrice: 1050,
        stock: 25,
        lowStockThreshold: 5,
        packSize: '1 Multi-Shot Cake Block',
        soundLevel: 'High Aerial Thud',
        visualEffect: '12 Sequential Aerial Bursts',
        safetyDistance: '15 Meters in Open Ground',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1508780709619-79562169bc64?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Grand Celebration 30 Shots Spectacular',
        sku: 'RF-AER-02',
        category: categoryMap['aerial-repeaters'],
        description: 'Our top-rated aerial cake. Produces a synchronized 45-second sky show with silver comets, purple peonies, and a crackling titanium finale.',
        price: 1850,
        originalPrice: 2200,
        stock: 14,
        lowStockThreshold: 5,
        packSize: '1 Heavy Display Cake',
        soundLevel: 'High Aerial Thud',
        visualEffect: '30 Multi-Color High Altitude Bursts',
        safetyDistance: '20 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1508780709619-79562169bc64?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Grand Finale 120 Shots Professional Display',
        sku: 'RF-AER-03',
        category: categoryMap['aerial-repeaters'],
        description: 'Professional grade celebration battery for weddings and grand community festivals. 120 rapid-fire aerial bursts lighting the entire sky.',
        price: 4500,
        originalPrice: 5200,
        stock: 6, // Low stock demo
        lowStockThreshold: 8,
        packSize: '1 Grand Finale Crate',
        soundLevel: 'High Aerial Thud',
        visualEffect: 'Grand Sky Tapestry Finale',
        safetyDistance: '25 Meters',
        isGreenCracker: true,
        isFeatured: false,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1508780709619-79562169bc64?w=700&auto=format&fit=crop&q=80'],
      },

      // Festive Gift Boxes
      {
        name: 'Diwali Shubh Family Hamper (25 Items)',
        sku: 'RF-BOX-01',
        category: categoryMap['festive-gift-boxes'],
        description: 'Complete family joy box containing electric sparklers, 5 deluxe anars, 10 chakkars, 2 sky shots, pencils, and novelty items in a luxury festive presentation box.',
        price: 1950,
        originalPrice: 2400,
        stock: 30,
        lowStockThreshold: 10,
        packSize: '1 Luxury Gift Box (25 Varied Items)',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Comprehensive Family Festive Mix',
        safetyDistance: '5 to 15 Meters depending on item',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Royal Heritage Celebration Box (45 Items)',
        sku: 'RF-BOX-02',
        category: categoryMap['festive-gift-boxes'],
        description: 'Our most lavish festive box designed for grand celebrations. Includes mega sparklers, whistling fountains, spinning chakkars, aerial repeater cake, and color rockets.',
        price: 3600,
        originalPrice: 4500,
        stock: 18,
        lowStockThreshold: 5,
        packSize: '1 Master Wooden-Finish Hamper',
        soundLevel: 'Medium Boom',
        visualEffect: 'Master Celebration Assortment',
        safetyDistance: '15 Meters',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80'],
      },

      // Kids Special
      {
        name: 'Magic Snakes & Glow Tablets',
        sku: 'RF-KID-01',
        category: categoryMap['kids-special'],
        description: 'Zero sound magical expanding ash snakes that ignite smoothly on flat ground, providing joyful wonder for young children under adult supervision.',
        price: 80,
        originalPrice: 100,
        stock: 200,
        lowStockThreshold: 30,
        packSize: 'Pack of 10 Tablets',
        soundLevel: 'Soundless',
        visualEffect: 'Magical Expanding Glowing Ash',
        safetyDistance: '1 Meter',
        isGreenCracker: true,
        isFeatured: false,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=700&auto=format&fit=crop&q=80'],
      },
      {
        name: 'Pop-Pop Festive Snappers (Drop & Pop)',
        sku: 'RF-KID-02',
        category: categoryMap['kids-special'],
        description: 'No flame, no lighter required! Simple friction snappers that produce a fun mini pop when thrown onto a hard surface.',
        price: 60,
        originalPrice: 80,
        stock: 250,
        lowStockThreshold: 40,
        packSize: 'Box of 50 Snapper Packets',
        soundLevel: 'Mild Crackle',
        visualEffect: 'Instant Mini Pop without Flame',
        safetyDistance: '1 Meter',
        isGreenCracker: true,
        isFeatured: true,
        isVisible: true,
        images: ['https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=700&auto=format&fit=crop&q=80'],
      },
    ];

    for (const prod of productsData) {
      const createdProd = await Product.create(prod);

      // Create initial stock audit log
      await InventoryLog.create({
        product: createdProd._id,
        productName: createdProd.name,
        sku: createdProd.sku,
        previousStock: 0,
        newStock: createdProd.stock,
        change: createdProd.stock,
        type: 'INCREASE',
        reason: 'Initial catalogue load',
        note: 'Seeded verified inventory data',
        adjustedBy: 'Rohan Sharma',
      });
    }

    console.log(`[Seed] Seeded ${productsData.length} products with inventory tracking`);
  }

  // 5. Seed a realistic sample enquiry for dashboard overview demo
  const enquiryCount = await Enquiry.countDocuments();
  if (enquiryCount === 0) {
    const sampleProduct1 = await Product.findOne({ sku: 'RF-BOX-01' });
    const sampleProduct2 = await Product.findOne({ sku: 'RF-SPK-01' });

    if (sampleProduct1 && sampleProduct2) {
      await Enquiry.create({
        enquiryNumber: 'RF-ENQ-2026-1001',
        customerName: 'Vikramaditya Verma',
        phone: '+91 98451 23456',
        email: 'vikram.verma@example.com',
        city: 'Bengaluru',
        address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
        items: [
          {
            product: sampleProduct1._id,
            name: sampleProduct1.name,
            sku: sampleProduct1.sku,
            price: sampleProduct1.price,
            quantity: 2,
            subtotal: sampleProduct1.price * 2,
          },
          {
            product: sampleProduct2._id,
            name: sampleProduct2.name,
            sku: sampleProduct2.sku,
            price: sampleProduct2.price,
            quantity: 4,
            subtotal: sampleProduct2.price * 4,
          }
        ],
        totalEstimatedValue: (sampleProduct1.price * 2) + (sampleProduct2.price * 4),
        customerNotes: 'Need delivery confirmation for family Diwali celebration. Please confirm WhatsApp availability.',
        status: 'New',
        adminNotes: 'Sample demonstration enquiry for dashboard testing.',
        channel: 'Web Catalogue Enquiry',
      });
      console.log('[Seed] Created sample festive enquiry for demonstration');
    }
  }

  console.log('[Seed] Database initialization complete!');
};

// If run directly via node command line
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
