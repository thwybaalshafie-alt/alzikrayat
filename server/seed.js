require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Photo = require('./models/Photo');
const Comment = require('./models/Comment');

const seedAssetsDir = path.join(__dirname, 'seed-assets');
const uploadsDir = path.join(__dirname, 'uploads');

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[Seed] Connected to MongoDB');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Copy sample images from seed-assets to uploads
  const sampleFiles = [
    'photo_6ab820b1b06dd6.59608123.jpg',
    'photo_6ab82197ad71f5.03727147.jpg',
    'photo_6ab821c425f331.14424017.jpg',
    'photo_6ab822288ad846.29243264.jpg',
  ];

  for (const fileName of sampleFiles) {
    const src = path.join(seedAssetsDir, fileName);
    const dest = path.join(uploadsDir, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // Clear existing records for a clean demo state
  await Promise.all([
    Comment.deleteMany({}),
    Photo.deleteMany({}),
    User.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash('Demo@1234', 10);

  const [thwyba, omar] = await User.create([
    {
      firstName: 'Thwyba',
      lastName: 'Alshafie',
      email: 'thwyba@alzikrayat.demo',
      password: hashedPassword,
      location: 'Khartoum, Sudan',
      occupation: 'Computer Science Student',
      description: 'Capturing favorite illustrations, digital art, and everyday memories on Alzikrayat.',
    },
    {
      firstName: 'Omar',
      lastName: 'Hassan',
      email: 'omar@alzikrayat.demo',
      password: hashedPassword,
      location: 'Omdurman, Sudan',
      occupation: 'Visual Designer',
      description: 'Collector of anime aesthetics, watercolor sketches, and storytelling frames.',
    },
  ]);

  const now = Date.now();
  const hour = 60 * 60 * 1000;

  const photos = await Photo.create([
    {
      userId: thwyba._id,
      fileName: 'photo_6ab820b1b06dd6.59608123.jpg',
      title: 'Fly High — Karasuno Duo',
      description: 'Number 9 and Number 10 standing shoulder to shoulder under the warm gymnasium lights, ready to take flight.',
      dateTime: new Date(now - 24 * hour),
      aiTags: ['anime', 'volleyball', 'teamwork', 'illustration', 'warm-light'],
      aiCaption: 'Two volleyball teammates in dark jerseys numbered 9 and 10 standing together in warm backlit dust with floating black feathers.',
    },
    {
      userId: thwyba._id,
      fileName: 'photo_6ab821c425f331.14424017.jpg',
      title: 'Afternoon in the Meadow',
      description: 'A quiet sunlit break resting on lush green grass surrounded by white spring blooms and dappled shade.',
      dateTime: new Date(now - 16 * hour),
      aiTags: ['meadow', 'friends', 'sunlight', 'anime', 'peaceful'],
      aiCaption: 'Four friends resting on a shaded green hill in front of sunlit white flowers and a picket fence while one holds an egg toward the sky.',
    },
    {
      userId: omar._id,
      fileName: 'photo_6ab82197ad71f5.03727147.jpg',
      title: 'Golden Gaze',
      description: 'A dramatic inverted close-up study highlighting contrasting heterochromia eyes and soft cel-shaded lighting.',
      dateTime: new Date(now - 8 * hour),
      aiTags: ['portrait', 'anime', 'close-up', 'yellow', 'art'],
      aiCaption: 'An upside-down close-up portrait of a blue-haired character in a yellow hoodie with distinct golden and teal eyes.',
    },
    {
      userId: thwyba._id,
      fileName: 'photo_6ab822288ad846.29243264.jpg',
      title: 'Spooky Watercolor Kirby',
      description: 'Soft traditional watercolor textures bringing a playful ghost costume to life with tiny blue wisps.',
      dateTime: new Date(now - 2 * hour),
      aiTags: ['watercolor', 'cute', 'ghost', 'kirby', 'pastel'],
      aiCaption: 'A delicate pastel watercolor illustration of a tiny character dressed in a draped ghost sheet flanked by two small blue spirit flames.',
    },
  ]);

  await Comment.create([
    {
      photoId: photos[0]._id,
      userId: omar._id,
      comment: 'The backlighting and floating feathers make this frame feel so cinematic!',
      dateTime: new Date(now - 20 * hour),
    },
    {
      photoId: photos[0]._id,
      userId: thwyba._id,
      comment: 'One of my all-time favorite moments — the teamwork energy is unmatched.',
      dateTime: new Date(now - 18 * hour),
    },
    {
      photoId: photos[1]._id,
      userId: omar._id,
      comment: 'Love the contrast between the shaded foreground and the bright meadow behind them.',
      dateTime: new Date(now - 12 * hour),
    },
    {
      photoId: photos[1]._id,
      userId: thwyba._id,
      comment: 'It really captures that slow summer afternoon feeling.',
      dateTime: new Date(now - 10 * hour),
    },
    {
      photoId: photos[2]._id,
      userId: thwyba._id,
      comment: 'The framing and eye detail here are gorgeous — great pick Omar!',
      dateTime: new Date(now - 5 * hour),
    },
    {
      photoId: photos[3]._id,
      userId: omar._id,
      comment: 'This watercolor texture is adorable! Easily the coziest artwork in the gallery.',
      dateTime: new Date(now - 1 * hour),
    },
  ]);

  console.log(`[Seed] Created ${2} users, ${photos.length} photos, and 6 comments.`);
  console.log('[Seed] Demo Login 1: thwyba@alzikrayat.demo / Demo@1234');
  console.log('[Seed] Demo Login 2: omar@alzikrayat.demo / Demo@1234');

  await mongoose.disconnect();
  console.log('[Seed] Done.');
}

seedDatabase().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
