// joc.js — logica jocului Dobble (stare, pachet, împărțire cărți, verificare)

import { simboluriAleatoare } from './simboluri.js';
import { Card } from './card.js';
import { simboluriPerCard } from './config.js';

export const joc = {
  stare: 'idle', // 'idle' | 'playing' | 'ended'
  simboluriPerCard: simboluriPerCard,
  pachet: [],
  carduriCurente: [],
  simbolComun: null,
  jucatori: [],
  onCorect: null,
  onGresit: null,

  seteazaJucatori: function (jucatori) {
    this.jucatori = jucatori;
  },

  genereazaPachet: function () {
    const n = this.simboluriPerCard;
    const pool = simboluriAleatoare(n * n);
    const baza = pool.slice(0, n);
    this.pachet = [];

    for (let i = 0; i <= Math.min(n, 18); i++) {
      let simboluri;
      if (i === 0) {
        simboluri = [...baza];
      } else {
        simboluri = [
          baza[i - 1],
          ...pool.slice(n + (i - 1) * (n - 1), n + i * (n - 1)).slice(0, n - 1),
        ];
      }
      const card = Object.create(Card);
      card.init(simboluri);
      this.pachet.push(card);
    }
  },

  imparte: function () {
    this.carduriCurente = [];
    const numar = Math.min(2, this.jucatori.length, this.pachet.length);
    for (let i = 0; i < numar; i++) {
      const card = this.pachet.shift();
      if (card) this.carduriCurente.push(card);
    }
    if (this.carduriCurente.length === 2) {
      this.simbolComun = this.carduriCurente[0].gasesteComunul(this.carduriCurente[1]);
    }
    if (this.pachet.length === 0 && this.carduriCurente.length === 0) {
      this.stare = 'ended';
    }
  },

  start: function () {
    if (!this.jucatori.length) return false;
    this.stare = 'playing';
    this.genereazaPachet();
    this.imparte();
    return true;
  },

  handleClick: function (jucator, simbol) {
    if (this.stare !== 'playing' || !this.simbolComun) return;
    if (simbol.name === this.simbolComun.name) {
      jucator.puncte++;
      if (this.onCorect) this.onCorect(jucator, simbol);
      this.imparte();
    } else {
      if (this.onGresit) this.onGresit(jucator, simbol);
    }
  },

  reseteaza: function () {
    this.stare = 'idle';
    this.pachet = [];
    this.carduriCurente = [];
    this.simbolComun = null;
    this.jucatori.forEach((j) => {
      j.puncte = 0;
    });
  },
};
