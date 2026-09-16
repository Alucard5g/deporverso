const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sportsList = [
  { id: 'futbol', name: 'FÚTBOL', icon: '⚽', color: '#f59e0b', source: 'src/assets/images/soccer_hero_banner_1785853921446.jpg', crop: { left: 450, top: 150, width: 450, height: 450 } },
  { id: 'basquetbol', name: 'BÁSQUETBOL', icon: '🏀', color: '#f97316', source: 'src/assets/images/basketball_hero_bg_1785854264293.jpg', crop: { left: 420, top: 120, width: 480, height: 480 } },
  { id: 'voleibol', name: 'VOLEIBOL', icon: '🏐', color: '#eab308', source: 'src/assets/images/volleyball_hero_bg_1785854282070.jpg', crop: { left: 400, top: 100, width: 500, height: 500 } },
  { id: 'futsal', name: 'FUTSAL', icon: '⚡', color: '#10b981', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 50, top: 50, width: 400, height: 400 } },
  { id: 'tenis', name: 'TENIS', icon: '🎾', color: '#84cc16', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 520, top: 50, width: 400, height: 400 } },
  { id: 'atletismo', name: 'ATLETISMO', icon: '🏃', color: '#fbbf24', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 60, top: 60, width: 420, height: 420 } },
  { id: 'boxeo', name: 'BOXEO', icon: '🥊', color: '#ef4444', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 520, top: 60, width: 420, height: 420 } },
  { id: 'beisbol', name: 'BÉISBOL', icon: '⚾', color: '#d97706', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 50, top: 520, width: 400, height: 400 } },
  { id: 'natacion', name: 'NATACIÓN', icon: '🏊', color: '#06b6d4', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 60, top: 520, width: 420, height: 420 } },
  { id: 'ciclismo', name: 'CICLISMO', icon: '🚴', color: '#14b8a6', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 520, top: 520, width: 420, height: 420 } },
  { id: 'padel', name: 'PÁDEL', icon: '🎾', color: '#22c55e', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 520, top: 520, width: 400, height: 400 } },
  { id: 'rugby', name: 'RUGBY', icon: '🏉', color: '#b45309', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 300, top: 300, width: 420, height: 420 } },
  { id: 'balonmano', name: 'BALONMANO', icon: '🤾', color: '#f59e0b', source: 'src/assets/images/volleyball_hero_bg_1785854282070.jpg', crop: { left: 200, top: 150, width: 450, height: 450 } },
  { id: 'gimnasia', name: 'GIMNASIA', icon: '🤸', color: '#a855f7', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 300, top: 300, width: 420, height: 420 } },
  { id: 'hockey', name: 'HOCKEY', icon: '🏑', color: '#38bdf8', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 150, top: 250, width: 420, height: 420 } },
  { id: 'tenis_mesa', name: 'TENIS MESA', icon: '🏓', color: '#f87171', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 450, top: 250, width: 420, height: 420 } },
  { id: 'taekwondo', name: 'TAEKWONDO', icon: '🥋', color: '#fb923c', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 200, top: 100, width: 400, height: 400 } },
  { id: 'skateboarding', name: 'SKATE', icon: '🛹', color: '#facc15', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 400, top: 400, width: 400, height: 400 } },
  { id: 'halterofilia', name: 'PESAS', icon: '🏋️', color: '#fb7185', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 100, top: 350, width: 400, height: 400 } },
  { id: 'badminton', name: 'BÁDMINTON', icon: '🏸', color: '#2dd4bf', source: 'src/assets/images/volleyball_hero_bg_1785854282070.jpg', crop: { left: 600, top: 200, width: 400, height: 400 } },
  { id: 'voleibol_playa', name: 'VOLEY PLAYA', icon: '🏖️', color: '#f59e0b', source: 'src/assets/images/volleyball_hero_bg_1785854282070.jpg', crop: { left: 350, top: 150, width: 450, height: 450 } },
  { id: 'crossfit', name: 'CROSSFIT', icon: '🔥', color: '#ef4444', source: 'src/assets/images/basketball_hero_bg_1785854264293.jpg', crop: { left: 200, top: 200, width: 450, height: 450 } },
  { id: 'esgrima', name: 'ESGRIMA', icon: '🤺', color: '#e2e8f0', source: 'src/assets/images/sports_athletes_mosaic_1789562678569.jpg', crop: { left: 250, top: 450, width: 400, height: 400 } },
  { id: 'tiro_arco', name: 'TIRO ARCO', icon: '🏹', color: '#34d399', source: 'src/assets/images/athletes_action_sports_1789562695487.jpg', crop: { left: 350, top: 150, width: 400, height: 400 } }
];

async function generate() {
  const outputDir = path.join(__dirname, 'public', 'sports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const item of sportsList) {
    const outputPath = path.join(outputDir, `${item.id}.webp`);
    
    // Create an SVG overlay for the card to guarantee the amber square styling from the user's screenshot
    // Golden border, subtle amber gradient tint, athletic badge
    const svgOverlay = Buffer.from(`
      <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/>
            <stop offset="60%" stop-color="#b45309" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
          </linearGradient>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.95"/>
            <stop offset="50%" stop-color="#d97706" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#78350f" stop-opacity="0.5"/>
          </linearGradient>
        </defs>
        <!-- Amber tint overlay -->
        <rect x="0" y="0" width="256" height="256" rx="8" fill="url(#amberGlow)" />
        <!-- Sharp golden frame matching the perspective square tiles -->
        <rect x="3" y="3" width="250" height="250" rx="6" fill="none" stroke="url(#borderGrad)" stroke-width="4"/>
        
        <!-- Bottom sport badge tag -->
        <rect x="8" y="210" width="240" height="38" rx="6" fill="#000000" fill-opacity="0.75" stroke="#f59e0b" stroke-width="1"/>
        <text x="128" y="235" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="2">
          ${item.icon} ${item.name}
        </text>
      </svg>
    `);

    try {
      await sharp(item.source)
        .extract(item.crop)
        .resize(256, 256, { fit: 'cover' })
        .modulate({
          brightness: 1.05,
          saturation: 1.25
        })
        .composite([
          { input: svgOverlay, top: 0, left: 0 }
        ])
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`Generated: ${item.id}.webp`);
    } catch (err) {
      console.error(`Error generating ${item.id}:`, err);
    }
  }

  // Also write an index JSON for easy dynamic consumption by Three.js / React
  const manifest = sportsList.map(s => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    url: `/sports/${s.id}.webp`
  }));
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('All WebP sports images generated successfully!');
}

generate();
