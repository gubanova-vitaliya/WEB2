const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#007bff');
    gradient.addColorStop(1, '#0056b3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add border radius effect
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.1);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Icon - molecule symbol
    ctx.fillStyle = 'white';
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.05;
    
    // Central atom
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Surrounding atoms
    const atomPositions = [
        { x: centerX - size * 0.2, y: centerY - size * 0.15 },
        { x: centerX + size * 0.2, y: centerY - size * 0.15 },
        { x: centerX - size * 0.2, y: centerY + size * 0.15 },
        { x: centerX + size * 0.2, y: centerY + size * 0.15 }
    ];
    
    atomPositions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 0.7, 0, 2 * Math.PI);
        ctx.fill();
        
        // Connection lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = size * 0.01;
        ctx.stroke();
    });
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.12}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('GAS', centerX, centerY + size * 0.35);
    
    return canvas.toBuffer('image/png');
}

// Create icons
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Generate 192x192 icon
const icon192 = createIcon(192);
fs.writeFileSync(path.join(publicDir, 'logo192.png'), icon192);

// Generate 512x512 icon
const icon512 = createIcon(512);
fs.writeFileSync(path.join(publicDir, 'logo512.png'), icon512);

console.log('Icons generated successfully!');

