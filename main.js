import { boardWidth, boardHeight, PUNCTE_CASTIG } from './config.js';
import { Buton } from './buton.js';
import { joc } from './joc.js';
import { jucatori, seteazaJucatori, mesaj } from './jucatori.js';
import { Computer } from './computer.js';

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

  if (joc.stare === 'ended' && joc.castigator) {
    const castig = joc.castigator;
    const altul = jucatori.find((j) => j.id !== castig.id);

    textAlign(CENTER, CENTER);
    noStroke();

    textSize(W * 0.09);
    text('🏆', W / 2, H / 2 - 55);

    fill(castig.culoare);
    textSize(W * 0.045);
    text(`${castig.nume} a câștigat!`, W / 2, H / 2 + 5);

    fill(80);
    textSize(W * 0.026);
    if (altul) {
      text(
        `${castig.nume} ${castig.puncte}p  —  ${altul.nume} ${altul.puncte}p`,
        W / 2, H / 2 + 45
      );
    }

  } else if (carduri.length >= 2) {
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
      const prefix = Computer.activ
        ? (Computer.mod === 'medium' ? '🧠' : '🤖')
        : '';
      text(`${prefix} ${jucatori[1].nume}  ${jucatori[1].puncte}p`, cx + gap, 8);
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
    }
  }

  butonStart.deseneaza();
  butonReset.deseneaza();
}

async function mousePressed() {
  butonStart.esteClicat(mouseX, mouseY, startJoc);
  butonReset.esteClicat(mouseX, mouseY, resetJoc);

  if (joc.stare !== 'playing') return;

  const eModComputer = Computer.activ;
  const jucator = mouseX < boardWidth / 2
    ? jucatori[0]
    : (eModComputer ? null : jucatori[1]);
  if (!jucator) return;

  for (const card of joc.carduriCurente) {
    const sim = card.clicat(mouseX, mouseY);
    if (sim) {
      const puncteInainte = jucatori[0] ? jucatori[0].puncte : 0;
      await joc.handleClick(jucator, sim);
      if (eModComputer && joc.stare === 'playing') {
        
        if (jucatori[0] && jucatori[0].puncte > puncteInainte) {
          Computer.resetRunda();
        }
        planificaMutareComputer();
      }
      break;
    }
  }
}

function planificaMutareComputer() {
  Computer.planificaMutare(joc, async (simAles) => {
    if (joc.stare !== 'playing' || !Computer.activ) return;

    const jucatorPC = jucatori[1];
    if (!jucatorPC) return;

    simAles.selectat = true;
    await new Promise((r) => setTimeout(r, 280));
    simAles.selectat = false;

    const puncteInainte = jucatorPC.puncte;
    await joc.handleClick(jucatorPC, simAles);

    if (joc.stare === 'playing' && Computer.activ) {
      
      if (jucatorPC.puncte > puncteInainte) {
        Computer.resetRunda();
      }
      planificaMutareComputer();
    }
  });
}

async function startJoc() {
  const n1 = document.getElementById('p1Name').value.trim();
  const modJoc = window._modJoc || '2p';
  const eModComputer = modJoc !== '2p';

  if (!n1) {
    mesaj('⚠️ Introdu numele Jucătorului 1!');
    document.getElementById('p1Name').focus();
    return;
  }

  const numeBot = modJoc === 'medium' ? 'Medium Bot' : 'Easy Bot';
  const culoareBot = modJoc === 'medium' ? '#3D85C8' : '#888888';

  const n2 = eModComputer
    ? numeBot
    : (document.getElementById('p2Name').value.trim() || 'Jucător 2');

  const noiJucatori = [
    { id: 1, nume: n1, culoare: document.getElementById('p1Color').value, puncte: 0 },
    { id: 2, nume: n2, culoare: eModComputer ? culoareBot : document.getElementById('p2Color').value, puncte: 0 },
  ];

  seteazaJucatori(noiJucatori);
  joc.seteazaJucatori(noiJucatori);

  joc.onCorect = (j, s) => {
    const icon = Computer.activ && j.id === 2
      ? (Computer.mod === 'medium' ? '🧠' : '🤖')
      : '✅';
    mesaj(`${icon} ${j.nume} a găsit ${s.emoji}! +1 punct`);
  };
  joc.onGresit = (j, s) => {
    const icon = Computer.activ && j.id === 2
      ? (Computer.mod === 'medium' ? '🧠' : '🤖')
      : '❌';
    mesaj(`${icon} ${j.nume} a greșit cu ${s.emoji}`);
  };
  joc.onCastig = (j) => {
    mesaj(`🏆 ${j.nume} a câștigat cu ${j.puncte} puncte!`, 0);
    Computer.anuleaza();
  };

  if (!await joc.start()) return;

  if (eModComputer) {
    Computer.init(noiJucatori[1], modJoc); 
    const icon = modJoc === 'medium' ? '🧠' : '🤖';
    mesaj(`🎮 ${n1} vs ${icon} ${numeBot} — primul la ${PUNCTE_CASTIG}p câștigă!`);
    planificaMutareComputer();
  } else {
    Computer.reset();
    mesaj(`🎮 ${noiJucatori[0].nume} vs ${noiJucatori[1].nume} — primul la ${PUNCTE_CASTIG}p câștigă!`);
  }
}

async function resetJoc() {
  if (joc.stare === 'playing' && !confirm('Resetezi jocul?')) return;
  Computer.reset();
  seteazaJucatori([]);
  await joc.reseteaza();
  mesaj('↺ Joc resetat.');
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
