'use strict';

/**
 * Kid-friendly cartoon animals. Prefer side-ish silhouettes so features
 * (trunk, beak, snout) read as the real animal — never a mouth stacked above
 * a hanging trunk.
 */

function eye(ctx, x, y, r = 4) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x + r * 0.15, y, r * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function leg(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - w / 2, y, w, h, w * 0.35);
  else ctx.rect(x - w / 2, y, w, h);
  ctx.fill();
}

function shadow(ctx, y = 48, rx = 36) {
  ctx.fillStyle = 'rgba(0,0,0,0.14)';
  ctx.beginPath();
  ctx.ellipse(0, y, rx, 9, 0, 0, Math.PI * 2);
  ctx.fill();
}

const DRAW = {
  /**
   * Side-view elephant: trunk curves FORWARD from the face (nose),
   * not a mouth above a dangling tube.
   */
  elephant(ctx, a) {
    const body = a.body;
    const ear = a.ear;
    const dark = '#7A8494';

    // Legs
    leg(ctx, -18, 28, 14, 28, body);
    leg(ctx, 8, 28, 14, 28, body);
    leg(ctx, 28, 28, 12, 26, dark);
    leg(ctx, -2, 28, 12, 26, dark);

    // Body
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(4, 8, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ear (big flap behind head)
    ctx.fillStyle = ear;
    ctx.beginPath();
    ctx.ellipse(-8, -18, 28, 32, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#B8C0CC';
    ctx.beginPath();
    ctx.ellipse(-10, -18, 16, 20, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(-28, -6, 26, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk from snout — S-curve FORWARD then gentle down (classic profile)
    ctx.strokeStyle = body;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-48, 2);
    ctx.bezierCurveTo(-62, 8, -68, 22, -58, 38);
    ctx.bezierCurveTo(-52, 48, -44, 46, -40, 40);
    ctx.stroke();
    // Trunk highlight
    ctx.strokeStyle = a.belly || '#D0D5E0';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-50, 4);
    ctx.bezierCurveTo(-60, 10, -64, 22, -56, 36);
    ctx.stroke();
    // Trunk tip opening (oval, sideways — clearly a nose tip)
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.ellipse(-40, 42, 6, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Small tusk (optional friendly curve)
    ctx.strokeStyle = '#F5F0E6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-46, 8);
    ctx.quadraticCurveTo(-54, 16, -50, 24);
    ctx.stroke();

    // Eye on side of head (above trunk root)
    eye(ctx, -34, -14, 5);

    // Cheek blush
    ctx.fillStyle = 'rgba(255,180,180,0.35)';
    ctx.beginPath();
    ctx.ellipse(-22, -2, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  lion(ctx, a) {
    // Side-view cubby lion with mane ring around head
    leg(ctx, -16, 30, 12, 24, a.body);
    leg(ctx, 18, 30, 12, 24, a.body);

    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(6, 10, 36, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(8, 16, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = a.body;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(38, 0);
    ctx.quadraticCurveTo(58, -20, 52, -36);
    ctx.stroke();
    ctx.fillStyle = a.mane;
    ctx.beginPath();
    ctx.arc(52, -38, 8, 0, Math.PI * 2);
    ctx.fill();

    // Mane fluff behind head
    ctx.fillStyle = a.mane;
    for (let i = 0; i < 10; i++) {
      const ang = -0.8 + i * 0.28;
      ctx.beginPath();
      ctx.ellipse(-28 + Math.cos(ang) * 22, -8 + Math.sin(ang) * 22, 12, 10, ang, 0, Math.PI * 2);
      ctx.fill();
    }

    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-30, -6, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(-42, 2, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.ellipse(-46, -2, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    eye(ctx, -34, -12, 4.5);
    // Ear
    ctx.fillStyle = a.mane;
    ctx.beginPath();
    ctx.arc(-22, -24, 8, 0, Math.PI * 2);
    ctx.fill();
  },

  giraffe(ctx, a) {
    leg(ctx, -10, 32, 10, 26, a.body);
    leg(ctx, 16, 32, 10, 26, a.body);

    // Body
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(8, 16, 30, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spots on body
    ctx.fillStyle = a.spots;
    for (const [x, y, rx, ry] of [[0, 10, 7, 5], [18, 18, 6, 4], [10, 22, 5, 4], [-6, 18, 5, 3]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Long neck
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(-18, -50);
    ctx.lineTo(-4, -52);
    ctx.lineTo(8, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = a.spots;
    ctx.beginPath();
    ctx.ellipse(-10, -20, 5, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(-14, -38, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (profile)
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-22, -58, 18, 12, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.beginPath();
    ctx.ellipse(-36, -54, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ossicones
    ctx.fillStyle = a.spots;
    ctx.fillRect(-26, -76, 4, 12);
    ctx.fillRect(-16, -74, 4, 10);
    ctx.beginPath();
    ctx.arc(-24, -76, 4, 0, Math.PI * 2);
    ctx.arc(-14, -74, 4, 0, Math.PI * 2);
    ctx.fill();
    // Ear
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-12, -66, 5, 8, 0.5, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -26, -60, 3.5);
  },

  duck(ctx, a) {
    // Classic side duck
    // Body
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(4, 12, 34, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wing
    ctx.fillStyle = a.wing;
    ctx.beginPath();
    ctx.ellipse(10, 10, 16, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(30, 4);
    ctx.lineTo(48, -8);
    ctx.lineTo(36, 16);
    ctx.closePath();
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.arc(-18, -8, 18, 0, Math.PI * 2);
    ctx.fill();
    // Beak (profile)
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.moveTo(-32, -6);
    ctx.lineTo(-52, -2);
    ctx.lineTo(-32, 4);
    ctx.closePath();
    ctx.fill();
    eye(ctx, -22, -12, 4);
    // Cute cheek
    ctx.fillStyle = 'rgba(255,120,100,0.35)';
    ctx.beginPath();
    ctx.ellipse(-14, -2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  frog(ctx, a) {
    // Sitting frog, face-forward (frogs are fine front-on)
    // Back legs
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-28, 24, 16, 10, -0.4, 0, Math.PI * 2);
    ctx.ellipse(28, 24, 16, 10, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 12, 34, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 16, 20, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head / eyes on top
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, -8, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye bumps
    ctx.beginPath();
    ctx.arc(-14, -22, 12, 0, Math.PI * 2);
    ctx.arc(14, -22, 12, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -14, -22, 6);
    eye(ctx, 14, -22, 6);
    // Smile under eyes (normal frog face — no trunk)
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -2, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  },

  fish(ctx, a) {
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stripes
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-4, -16);
    ctx.quadraticCurveTo(0, 0, -4, 16);
    ctx.moveTo(10, -14);
    ctx.quadraticCurveTo(14, 0, 10, 14);
    ctx.stroke();
    // Tail
    ctx.fillStyle = a.fin;
    ctx.beginPath();
    ctx.moveTo(34, 0);
    ctx.lineTo(58, -18);
    ctx.lineTo(52, 0);
    ctx.lineTo(58, 18);
    ctx.closePath();
    ctx.fill();
    // Top fin
    ctx.beginPath();
    ctx.moveTo(-4, -20);
    ctx.lineTo(8, -36);
    ctx.lineTo(16, -16);
    ctx.closePath();
    ctx.fill();
    eye(ctx, -18, -4, 6);
  },

  cow(ctx, a) {
    leg(ctx, -16, 30, 12, 24, a.body);
    leg(ctx, 18, 30, 12, 24, a.body);
    // Udder-safe: no underside details — just body + spots
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(4, 10, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.spot;
    ctx.beginPath();
    ctx.ellipse(-8, 4, 12, 10, 0.2, 0, Math.PI * 2);
    ctx.ellipse(18, 14, 10, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Head profile-ish
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-32, -8, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.fillStyle = a.snout;
    ctx.beginPath();
    ctx.ellipse(-48, 0, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(-52, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(-46, 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Ear
    ctx.fillStyle = a.spot;
    ctx.beginPath();
    ctx.ellipse(-22, -24, 8, 10, -0.5, 0, Math.PI * 2);
    ctx.fill();
    // Horn stubs (tiny, friendly)
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.moveTo(-36, -26);
    ctx.lineTo(-34, -36);
    ctx.lineTo(-28, -26);
    ctx.closePath();
    ctx.fill();
    eye(ctx, -36, -12, 4);
  },

  pig(ctx, a) {
    leg(ctx, -14, 30, 11, 22, a.body);
    leg(ctx, 16, 30, 11, 22, a.body);
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(2, 10, 34, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail curl
    ctx.strokeStyle = a.body;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(36, 0, 8, 0, Math.PI * 1.5);
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.ellipse(-28, 0, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.beginPath();
    ctx.moveTo(-36, -16);
    ctx.lineTo(-40, -36);
    ctx.lineTo(-24, -18);
    ctx.closePath();
    ctx.moveTo(-18, -16);
    ctx.lineTo(-12, -36);
    ctx.lineTo(-8, -14);
    ctx.closePath();
    ctx.fill();
    // Snout facing camera-left (disk on face)
    ctx.fillStyle = a.snout;
    ctx.beginPath();
    ctx.ellipse(-42, 4, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#AD1457';
    ctx.beginPath();
    ctx.ellipse(-46, 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(-38, 6, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -30, -8, 4);
  },

  chicken(ctx, a) {
    // Side hen
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(4, 14, 28, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail feathers
    ctx.fillStyle = '#FFE082';
    ctx.beginPath();
    ctx.ellipse(28, 0, 14, 18, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Wing
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(6, 12, 14, 10, -0.2, 0, Math.PI * 2);
    ctx.stroke();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(-16, -10, 16, 0, Math.PI * 2);
    ctx.fill();
    // Comb
    ctx.fillStyle = a.comb;
    ctx.beginPath();
    ctx.arc(-20, -26, 6, 0, Math.PI * 2);
    ctx.arc(-12, -30, 7, 0, Math.PI * 2);
    ctx.arc(-6, -24, 5, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.moveTo(-28, -8);
    ctx.lineTo(-44, -4);
    ctx.lineTo(-28, 0);
    ctx.closePath();
    ctx.fill();
    // Wattle
    ctx.fillStyle = a.comb;
    ctx.beginPath();
    ctx.ellipse(-26, 2, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -18, -12, 3.5);
  },

  bear(ctx, a) {
    leg(ctx, -14, 32, 14, 22, a.body);
    leg(ctx, 16, 32, 14, 22, a.body);
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(2, 10, 36, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(4, 16, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(-26, -8, 24, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.beginPath();
    ctx.arc(-38, -26, 10, 0, Math.PI * 2);
    ctx.arc(-14, -28, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.arc(-38, -26, 5, 0, Math.PI * 2);
    ctx.arc(-14, -28, 5, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.beginPath();
    ctx.ellipse(-40, 0, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.ellipse(-44, -2, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -28, -12, 4);
  },

  owl(ctx, a) {
    // Front owl is iconic
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, 10, 32, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.ellipse(0, 16, 20, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ear tufts
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.moveTo(-24, -20);
    ctx.lineTo(-18, -48);
    ctx.lineTo(-6, -24);
    ctx.closePath();
    ctx.moveTo(24, -20);
    ctx.lineTo(18, -48);
    ctx.lineTo(6, -24);
    ctx.closePath();
    ctx.fill();
    // Face disk
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.ellipse(0, -6, 28, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -12, -8, 8);
    eye(ctx, 12, -8, 8);
    // Beak
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 12);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();
    // Feet
    ctx.fillStyle = a.beak;
    ctx.beginPath();
    ctx.ellipse(-10, 46, 8, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(10, 46, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  bunny(ctx, a) {
    leg(ctx, -10, 34, 10, 16, a.body);
    leg(ctx, 12, 34, 10, 16, a.body);
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(0, 14, 28, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.ellipse(-4, -14, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears UP (not trunk-like)
    ctx.beginPath();
    ctx.ellipse(-14, -48, 8, 24, -0.1, 0, Math.PI * 2);
    ctx.ellipse(4, -50, 8, 24, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-14, -48, 4, 16, -0.1, 0, Math.PI * 2);
    ctx.ellipse(4, -50, 4, 16, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-4, -6, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -12, -16, 4);
    eye(ctx, 4, -16, 4);
    // Fluffy tail
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.arc(24, 20, 10, 0, Math.PI * 2);
    ctx.fill();
  },

  cat(ctx, a) {
    leg(ctx, -12, 32, 10, 20, a.body);
    leg(ctx, 14, 32, 10, 20, a.body);
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(2, 12, 30, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.strokeStyle = a.body;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(28, 8);
    ctx.quadraticCurveTo(48, -10, 40, -28);
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.ellipse(-22, -6, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pointy ears
    ctx.beginPath();
    ctx.moveTo(-34, -16);
    ctx.lineTo(-30, -38);
    ctx.lineTo(-18, -18);
    ctx.closePath();
    ctx.moveTo(-14, -18);
    ctx.lineTo(-6, -38);
    ctx.lineTo(0, -12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = a.belly;
    ctx.beginPath();
    ctx.moveTo(-30, -18);
    ctx.lineTo(-28, -30);
    ctx.lineTo(-22, -18);
    ctx.closePath();
    ctx.fill();
    // Muzzle
    ctx.beginPath();
    ctx.ellipse(-30, 2, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E91E63';
    ctx.beginPath();
    ctx.moveTo(-34, -2);
    ctx.lineTo(-30, 4);
    ctx.lineTo(-26, -2);
    ctx.closePath();
    ctx.fill();
    eye(ctx, -26, -10, 4);
    // Whiskers
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-36, 2);
    ctx.lineTo(-52, -2);
    ctx.moveTo(-36, 6);
    ctx.lineTo(-52, 8);
    ctx.stroke();
  },

  dog(ctx, a) {
    leg(ctx, -14, 32, 11, 22, a.body);
    leg(ctx, 16, 32, 11, 22, a.body);
    ctx.fillStyle = a.body;
    ctx.beginPath();
    ctx.ellipse(4, 10, 34, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail wag-ready
    ctx.strokeStyle = a.body;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(34, 0);
    ctx.quadraticCurveTo(50, -16, 44, -30);
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.ellipse(-28, -4, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Floppy ear
    ctx.fillStyle = a.ear;
    ctx.beginPath();
    ctx.ellipse(-20, 4, 10, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.fillStyle = '#EFEBE9';
    ctx.beginPath();
    ctx.ellipse(-44, 2, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.ellipse(-50, 0, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tongue
    ctx.fillStyle = '#EF9A9A';
    ctx.beginPath();
    ctx.ellipse(-44, 12, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -30, -10, 4);
  },
};

function drawAnimalSprite(ctx, animal, scale = 1, extras = {}) {
  const fn = DRAW[animal.draw];
  if (!fn) return;
  ctx.save();
  ctx.scale(scale, scale);
  if (extras.flip) ctx.scale(-1, 1);
  if (extras.spin) ctx.rotate(extras.spin);
  shadow(ctx, 52, 38);
  fn(ctx, animal);

  // Happy hearts / stars overlay after taps
  if (extras.hearts) {
    ctx.fillStyle = '#FF6B8A';
    ctx.globalAlpha = 0.9;
    const hx = -20;
    const hy = -50;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 4);
    ctx.bezierCurveTo(hx - 10, hy - 8, hx - 18, hy + 6, hx, hy + 18);
    ctx.bezierCurveTo(hx + 18, hy + 6, hx + 10, hy - 8, hx, hy + 4);
    ctx.fill();
  }
  ctx.restore();
}
