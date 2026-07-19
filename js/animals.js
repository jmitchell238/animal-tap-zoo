'use strict';

/** Shared face helper */
function drawFace(ctx, eyeY = -6, eyeSpread = 14, eyeR = 5) {
  // Eyes
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(-eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
  ctx.arc(eyeSpread, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  // Shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-eyeSpread + 1.5, eyeY - 1.5, eyeR * 0.35, 0, Math.PI * 2);
  ctx.arc(eyeSpread + 1.5, eyeY - 1.5, eyeR * 0.35, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, eyeY + 10, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

function roundBody(ctx, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 8, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
}

const DRAW = {
  lion(ctx, a) {
    // Mane
    ctx.fillStyle = a.mane;
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(ang) * 38, Math.sin(ang) * 38 - 4, 18, 14, ang, 0, Math.PI * 2);
      ctx.fill();
    }
    roundBody(ctx, 42, 40, a.body);
    // Belly
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 14, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFace(ctx, -8, 14, 5.5);
    // Nose
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.ellipse(0, 4, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  elephant(ctx, a) {
    // Ears
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-48, 0, 22, 28, -0.2, 0, Math.PI * 2);
    ctx.ellipse(48, 0, 22, 28, 0.2, 0, Math.PI * 2);
    ctx.fill();
    roundBody(ctx, 48, 42, a.body);
    // Trunk
    ctx.strokeStyle = a.body;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(8, 50, -6, 70);
    ctx.stroke();
    ctx.strokeStyle = a.belly;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.quadraticCurveTo(6, 48, -4, 66);
    ctx.stroke();
    drawFace(ctx, -10, 16, 5);
  },

  giraffe(ctx, a) {
    // Neck
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.roundRect(-12, -70, 24, 70, 10);
    ctx.fill();
    // Spots on neck
    ctx.fillStyle = a.spots;
    ctx.beginPath();
    ctx.ellipse(-2, -50, 6, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -30, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, -78, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ossicones
    ctx.fillStyle = a.spots;
    ctx.fillRect(-10, -100, 5, 14);
    ctx.fillRect(5, -100, 5, 14);
    ctx.beginPath();
    ctx.arc(-7.5, -100, 5, 0, Math.PI * 2);
    ctx.arc(7.5, -100, 5, 0, Math.PI * 2);
    ctx.fill();
    // Body
    roundBody(ctx, 40, 32, a.body);
    ctx.fillStyle = a.spots;
    for (const [x, y] of [[-12, 0], [10, 12], [-4, 18], [14, -4]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Face on head
    ctx.save();
    ctx.translate(0, -78);
    drawFace(ctx, 0, 10, 4);
    ctx.restore();
  },

  duck(ctx, a) {
    // Body
    roundBody(ctx, 40, 32, a.body);
    // Wing
    ctx.fillStyle = a.wing;
    ctx.beginPath();
    ctx.ellipse(8, 10, 18, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(-8, -28, 22, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.ellipse(-28, -24, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-14, -32, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-13, -33, 1.5, 0, Math.PI * 2);
    ctx.fill();
  },

  frog(ctx, a) {
    roundBody(ctx, 44, 34, a.body);
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye bumps
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(-18, -22, 14, 0, Math.PI * 2);
    ctx.arc(18, -22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-18, -22, 9, 0, Math.PI * 2);
    ctx.arc(18, -22, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-18, -22, 5, 0, Math.PI * 2);
    ctx.arc(18, -22, 5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  },

  fish(ctx, a) {
    // Body
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.fillStyle = a.fin;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(68, -22);
    ctx.lineTo(68, 22);
    ctx.closePath();
    ctx.fill();
    // Fin
    ctx.beginPath();
    ctx.moveTo(-4, -20);
    ctx.lineTo(12, -40);
    ctx.lineTo(16, -14);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-20, -4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-18, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.strokeStyle = '#BF360C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-24, 8, 8, 0.1 * Math.PI, 0.7 * Math.PI);
    ctx.stroke();
  },

  cow(ctx, a) {
    roundBody(ctx, 48, 38, a.body);
    // Spots
    ctx.fillStyle = a.spot;
    ctx.beginPath();
    ctx.ellipse(-16, 0, 12, 10, 0.2, 0, Math.PI * 2);
    ctx.ellipse(14, 14, 10, 8, -0.3, 0, Math.PI * 2);
    ctx.ellipse(8, -8, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, -36, 28, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.fillStyle = a.snout;
    ctx.beginPath();
    ctx.ellipse(0, -24, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nostrils
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(-5, -24, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -24, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-12, -42, 4, 0, Math.PI * 2);
    ctx.arc(12, -42, 4, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.fillStyle = a.spot;
    ctx.beginPath();
    ctx.ellipse(-28, -48, 8, 10, -0.4, 0, Math.PI * 2);
    ctx.ellipse(28, -48, 8, 10, 0.4, 0, Math.PI * 2);
    ctx.fill();
  },

  pig(ctx, a) {
    roundBody(ctx, 44, 36, a.body);
    // Ears
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(-28, -20);
    ctx.lineTo(-18, -48);
    ctx.lineTo(-6, -22);
    ctx.closePath();
    ctx.moveTo(28, -20);
    ctx.lineTo(18, -48);
    ctx.lineTo(6, -22);
    ctx.closePath();
    ctx.fill();
    // Snout
    ctx.fillStyle = a.snout;
    ctx.beginPath();
    ctx.ellipse(0, 8, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#AD1457';
    ctx.beginPath();
    ctx.ellipse(-6, 8, 4, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(6, 8, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFace(ctx, -12, 14, 5);
  },

  chicken(ctx, a) {
    roundBody(ctx, 36, 34, a.body);
    // Comb
    ctx.fillStyle = a.comb;
    ctx.beginPath();
    ctx.arc(-6, -40, 8, 0, Math.PI * 2);
    ctx.arc(4, -46, 9, 0, Math.PI * 2);
    ctx.arc(12, -38, 7, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(0, -28, 22, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.moveTo(18, -26);
    ctx.lineTo(36, -22);
    ctx.lineTo(18, -16);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(6, -32, 4, 0, Math.PI * 2);
    ctx.fill();
    // Wing
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(4, 8, 16, 12, -0.2, 0, Math.PI * 2);
    ctx.stroke();
  },

  bear(ctx, a) {
    // Ears
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(-32, -32, 16, 0, Math.PI * 2);
    ctx.arc(32, -32, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.arc(-32, -32, 8, 0, Math.PI * 2);
    ctx.arc(32, -32, 8, 0, Math.PI * 2);
    ctx.fill();
    roundBody(ctx, 48, 44, a.body);
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 12, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFace(ctx, -14, 16, 5);
  },

  owl(ctx, a) {
    // Body
    roundBody(ctx, 40, 46, a.body);
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ear tufts
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(-28, -30);
    ctx.lineTo(-20, -58);
    ctx.lineTo(-8, -34);
    ctx.closePath();
    ctx.moveTo(28, -30);
    ctx.lineTo(20, -58);
    ctx.lineTo(8, -34);
    ctx.closePath();
    ctx.fill();
    // Eye rings
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.arc(-16, -10, 16, 0, Math.PI * 2);
    ctx.arc(16, -10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-16, -10, 7, 0, Math.PI * 2);
    ctx.arc(16, -10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-14, -12, 2.5, 0, Math.PI * 2);
    ctx.arc(18, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(-8, 12);
    ctx.lineTo(8, 12);
    ctx.closePath();
    ctx.fill();
  },

  bunny(ctx, a) {
    // Ears
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-16, -60, 10, 28, -0.15, 0, Math.PI * 2);
    ctx.ellipse(16, -60, 10, 28, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-16, -58, 5, 18, -0.15, 0, Math.PI * 2);
    ctx.ellipse(16, -58, 5, 18, 0.15, 0, Math.PI * 2);
    ctx.fill();
    roundBody(ctx, 40, 42, a.body);
    drawFace(ctx, -8, 12, 5);
    // Nose
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(0, 4, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  cat(ctx, a) {
    // Ears
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(-30, -20);
    ctx.lineTo(-18, -55);
    ctx.lineTo(-4, -24);
    ctx.closePath();
    ctx.moveTo(30, -20);
    ctx.lineTo(18, -55);
    ctx.lineTo(4, -24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.moveTo(-24, -24);
    ctx.lineTo(-18, -44);
    ctx.lineTo(-10, -26);
    ctx.closePath();
    ctx.moveTo(24, -24);
    ctx.lineTo(18, -44);
    ctx.lineTo(10, -26);
    ctx.closePath();
    ctx.fill();
    roundBody(ctx, 42, 40, a.body);
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 12, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFace(ctx, -8, 13, 5);
    // Whiskers
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 8, 6);
      ctx.lineTo(side * 36, 0);
      ctx.moveTo(side * 8, 10);
      ctx.lineTo(side * 36, 12);
      ctx.stroke();
    }
  },

  dog(ctx, a) {
    // Floppy ears
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-36, 0, 14, 26, 0.3, 0, Math.PI * 2);
    ctx.ellipse(36, 0, 14, 26, -0.3, 0, Math.PI * 2);
    ctx.fill();
    roundBody(ctx, 44, 40, a.body);
    // Snout
    ctx.fillStyle = '#EFEBE9';
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.ellipse(0, 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFace(ctx, -12, 14, 5);
    // Tongue
    ctx.fillStyle = '#EF9A9A';
    ctx.beginPath();
    ctx.ellipse(0, 20, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  },
};

function drawAnimalSprite(ctx, animal, scale = 1) {
  const fn = DRAW[animal.draw];
  if (!fn) return;
  ctx.save();
  ctx.scale(scale, scale);
  // Soft shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(0, 52, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  fn(ctx, animal);
  ctx.restore();
}
