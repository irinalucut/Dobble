// main.js
import { boardWidth, boardHeight } from './config.js';
import { Buton } from './buton.js';
import { joc } from './joc.js';
import { jucatori, seteazaJucatori, mesaj } from './jucatori.js';

let butonStart;
let butonReset;

function setup() {
  createCanvas(boardWidth, boardHeight).parent('canvasContainer');
  frameRate(60);

  butonStart = Object.create(Buton);
  butonStart.init(boardWidth / 2 - 130, boardHeight - 55, 110, 36, '#27AE60', '▶  Start');

  butonReset = Object.create(Buton);
  butonReset.init(boardWidth / 2 + 20, boardHeight - 55, 110, 36, '#C0392B', '↺  Reset');
}

function draw() {
  const W = boardWidth;
  const H = boardHeight;

  background(0, 0);
  noStroke();
  fill('#FFEE8C');
  rect(0, 0, W, H, 30);
  noStroke();
  fill(255, 255, 255, 10);
  for (let x = 0; x < W; x += 36)
    for (let y = 0; y < H; y += 36) circle(x + 18, y + 18, 2);

  const carduri = joc.carduriCurente;

  if (carduri.length >= 2) {
    const r = Math.min(W * 0.21, H * 0.43, 148);
    const gap = r + 18;
    const cx = W / 2;
    const cy = H * 0.48;

    carduri[0].seteazaPozitie(cx - gap, cy);
    carduri[1].seteazaPozitie(cx + gap, cy);
    carduri[0].deseneaza();
    carduri[1].deseneaza();

    stroke(255, 255, 255, 40);
    strokeWeight(1);
    drawingContext.setLineDash([5, 7]);
    line(W / 2, 12, W / 2, H - 70);
    drawingContext.setLineDash([]);

    noStroke();
    textSize(13);
    textAlign(CENTER, TOP);
    if (jucatori[0]) {
      fill(jucatori[0].culoare);
      text(`${jucatori[0].nume}  ${jucatori[0].puncte}p`, cx - gap, 8);
    }
    if (jucatori[1]) {
      fill(jucatori[1].culoare);
      text(`${jucatori[1].nume}  ${jucatori[1].puncte}p`, cx + gap, 8);
    }
  } else {
    textAlign(CENTER, CENTER);
    noStroke();
    if (joc.stare === 'idle') {
      textSize(W * 0.09);
      text('🔄', W / 2, H / 2 - 30);
      fill(255, 255, 255, 140);
      textSize(W * 0.025);
      text('Introdu jucătorii și apasă Start', W / 2, H / 2 + 40);
    } else if (joc.stare === 'ended') {
      textSize(W * 0.085);
      text('🏆', W / 2, H / 2 - 30);
      fill(244, 208, 63);
      textSize(W * 0.028);
      text('Joc terminat! Apasă Reset.', W / 2, H / 2 + 40);
    }
  }

  butonStart.deseneaza();
  butonReset.deseneaza();
}

async function mousePressed() {
  butonStart.esteClicat(mouseX, mouseY, startJoc);
  butonReset.esteClicat(mouseX, mouseY, resetJoc);

  if (joc.stare !== 'playing') return;

  const jucator = mouseX < boardWidth / 2 ? jucatori[0] : jucatori[1];
  if (!jucator) return;

  for (const card of joc.carduriCurente) {
    const sim = card.clicat(mouseX, mouseY);
    if (sim) {
      await joc.handleClick(jucator, sim);
      break;
    }
  }
}

async function startJoc() {
  const n1 = document.getElementById('p1Name').value.trim();
  const n2 = document.getElementById('p2Name').value.trim();
  if (!n1) {
    mesaj('⚠️ Introdu numele Jucătorului 1!');
    document.getElementById('p1Name').focus();
    return;
  }

  const noiJucatori = [
    { id: 1, nume: n1, culoare: document.getElementById('p1Color').value, puncte: 0 },
    { id: 2, nume: n2 || 'Jucător 2', culoare: document.getElementById('p2Color').value, puncte: 0 },
  ];

  seteazaJucatori(noiJucatori);
  joc.seteazaJucatori(noiJucatori);
  joc.onCorect = (j, s) => mesaj(`✅ ${j.nume} a găsit ${s.emoji}! +1 punct`);
  joc.onGresit = (j, s) => mesaj(`❌ ${j.nume} a greșit cu ${s.emoji}`);

  if (!await joc.start()) return;
  mesaj(`🎮 ${noiJucatori[0].nume} vs ${noiJucatori[1].nume}`);
}

async function resetJoc() {
  if (joc.stare === 'playing' && !confirm('Resetezi jocul?')) return;
  seteazaJucatori([]);
  await joc.reseteaza();
  mesaj('↺ Joc resetat.');
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;