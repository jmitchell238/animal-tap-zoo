'use strict';

// Animal Tap Zoo — tuning knobs
// Keep CACHE in sw.js in sync: 'animal-tap-zoo-' + GAME_VERSION
const GAME_VERSION = '1.1.001';
const GAME_VERSION_LABEL = 'v' + GAME_VERSION;
const GAME_NAME = 'Animal Tap Zoo';

// Logical stage size (letterboxed to fit screen)
const W = 390;
const H = 700;

const SAVE_KEY = 'animal-tap-zoo-save-v1';

// Habitats cycle order
const HABITAT_IDS = ['savanna', 'pond', 'farm', 'forest'];

const HABITATS = {
  savanna: {
    id: 'savanna',
    name: 'Savanna',
    skyTop: '#87CEEB',
    skyBot: '#FFE29A',
    ground: '#C4A35A',
    groundDark: '#A68B3D',
    accent: '#E8B84A',
  },
  pond: {
    id: 'pond',
    name: 'Pond',
    skyTop: '#7EC8E3',
    skyBot: '#B8E0D2',
    ground: '#4FA3C8',
    groundDark: '#3B8AAD',
    accent: '#7DFFA0',
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    skyTop: '#A8D8FF',
    skyBot: '#FFF3C4',
    ground: '#7CB342',
    groundDark: '#558B2F',
    accent: '#FFD56A',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    skyTop: '#8FBF9F',
    skyBot: '#D4E8C2',
    ground: '#5D8A4A',
    groundDark: '#3E6B32',
    accent: '#A8E6A0',
  },
};

/**
 * Animals: bodyColor, ear/feature colors, sound profile for Web Audio.
 * drawKey picks the canvas drawer in animals.js.
 */
const ANIMALS = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    habitats: ['savanna'],
    body: '#F4A460',
    mane: '#E07B2A',
    belly: '#FFE4B5',
    draw: 'lion',
    sound: { kind: 'roar', base: 120 },
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    habitats: ['savanna'],
    body: '#A8B0C0',
    ear: '#C5CCD8',
    belly: '#D0D5E0',
    draw: 'elephant',
    sound: { kind: 'trumpet', base: 180 },
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    habitats: ['savanna'],
    body: '#F0C674',
    spots: '#C9893A',
    belly: '#FFE9B8',
    draw: 'giraffe',
    sound: { kind: 'bleat', base: 280 },
  },
  {
    id: 'duck',
    name: 'Duck',
    emoji: '🦆',
    habitats: ['pond'],
    body: '#FFD54F',
    wing: '#FFF8E1',
    beak: '#FF8A65',
    draw: 'duck',
    sound: { kind: 'quack', base: 320 },
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    habitats: ['pond'],
    body: '#66BB6A',
    belly: '#C8E6C9',
    draw: 'frog',
    sound: { kind: 'ribbit', base: 200 },
  },
  {
    id: 'fish',
    name: 'Fish',
    emoji: '🐠',
    habitats: ['pond'],
    body: '#FF7043',
    fin: '#FFCC80',
    draw: 'fish',
    sound: { kind: 'blub', base: 400 },
  },
  {
    id: 'cow',
    name: 'Cow',
    emoji: '🐮',
    habitats: ['farm'],
    body: '#FFFFFF',
    spot: '#3E2723',
    snout: '#FFAB91',
    draw: 'cow',
    sound: { kind: 'moo', base: 140 },
  },
  {
    id: 'pig',
    name: 'Pig',
    emoji: '🐷',
    habitats: ['farm'],
    body: '#F8BBD0',
    snout: '#F48FB1',
    draw: 'pig',
    sound: { kind: 'oink', base: 260 },
  },
  {
    id: 'chicken',
    name: 'Chicken',
    emoji: '🐔',
    habitats: ['farm'],
    body: '#FFFDE7',
    comb: '#E53935',
    beak: '#FFB300',
    draw: 'chicken',
    sound: { kind: 'cluck', base: 380 },
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    habitats: ['forest'],
    body: '#8D6E63',
    belly: '#BCAAA4',
    draw: 'bear',
    sound: { kind: 'growl', base: 100 },
  },
  {
    id: 'owl',
    name: 'Owl',
    emoji: '🦉',
    habitats: ['forest'],
    body: '#A1887F',
    belly: '#EFEBE9',
    beak: '#FFB74D',
    draw: 'owl',
    sound: { kind: 'hoot', base: 240 },
  },
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    habitats: ['forest', 'farm'],
    body: '#F5F5F5',
    ear: '#F8BBD0',
    draw: 'bunny',
    sound: { kind: 'squeak', base: 520 },
  },
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    habitats: ['farm', 'forest'],
    body: '#FFB74D',
    belly: '#FFE0B2',
    draw: 'cat',
    sound: { kind: 'meow', base: 360 },
  },
  {
    id: 'dog',
    name: 'Dog',
    emoji: '🐶',
    habitats: ['farm', 'savanna'],
    body: '#D7CCC8',
    ear: '#A1887F',
    draw: 'dog',
    sound: { kind: 'bark', base: 300 },
  },
];

const PRAISE = [
  'Yay!', 'Wow!', 'Nice!', 'Again!', 'Soft!', 'Big!', 'Cute!',
  'Hello!', 'Tap!', 'Fun!', 'More!', 'Yes!',
];
