const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ColorThief = require('colorthief');

const POSTS_DIR = path.join(__dirname, '..', '_posts');
const ASSETS_DIR = path.join(__dirname, '..');

// Convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Lighten a color to make it subtle (mix with white)
function lightenColor(r, g, b, amount = 0.9) {
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);
  return rgbToHex(newR, newG, newB);
}

// Darken and saturate a color for category tag
function darkenColor(r, g, b, amount = 0.3) {
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));
  return rgbToHex(newR, newG, newB);
}

// Create a bolder, more contrasting color for hero section (70% towards white)
function heroColor(r, g, b, amount = 0.7) {
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);
  return rgbToHex(newR, newG, newB);
}

async function extractColors() {
  // Get all markdown files in _posts
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} posts to process...\n`);

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);

    // Skip if no image
    if (!parsed.data.image) {
      console.log(`⏭  ${file}: No hero image, skipping`);
      continue;
    }

    // Skip if already has all colors
    if (parsed.data.background_color && parsed.data.accent_color && parsed.data.hero_color) {
      console.log(`✓  ${file}: Already has colors`);
      continue;
    }

    // Get the image path
    let imagePath = parsed.data.image;
    if (imagePath.startsWith('/')) {
      imagePath = imagePath.slice(1);
    }
    const fullImagePath = path.join(ASSETS_DIR, imagePath);

    // Check if image exists
    if (!fs.existsSync(fullImagePath)) {
      console.log(`⚠  ${file}: Image not found at ${imagePath}`);
      continue;
    }

    try {
      // Extract dominant color
      const color = await ColorThief.getColor(fullImagePath);
      const [r, g, b] = color;

      // Create a very subtle tint (92% towards white)
      const backgroundColor = lightenColor(r, g, b, 0.92);
      // Create a darker accent for category tag
      const accentColor = darkenColor(r, g, b, 0.3);
      // Create a bolder color for homepage hero (70% towards white)
      const heroBackgroundColor = heroColor(r, g, b, 0.7);

      // Update front matter
      parsed.data.background_color = backgroundColor;
      parsed.data.accent_color = accentColor;
      parsed.data.hero_color = heroBackgroundColor;

      // Write back to file
      const newContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, newContent);

      console.log(`✓  ${file}: bg ${backgroundColor}, accent ${accentColor}, hero ${heroBackgroundColor}`);
    } catch (err) {
      console.log(`✗  ${file}: Error extracting color - ${err.message}`);
    }
  }

  console.log('\nDone!');
}

extractColors().catch(console.error);
