import { simboluriAleatoare, TOATE_SIMBOLURILE } from './simboluri.js';
import { Card } from './card.js';
import { simboluriPerCard, PUNCTE_CASTIG } from './config.js';

export const joc = {
  stare: 'idle',
  simboluriPerCard: simboluriPerCard,
  pachet: [],
  carduriCurente: [],
  simbolComun: null,
  jucatori: [],
  castigator: null,
  onCorect: null,
  onGresit: null,
  onCastig: null,

  seteazaJucatori: function (jucatori) {
    this.jucatori = jucatori;
  },

  genereazaPereche: function () {
    const n = this.simboluriPerCard;
    const pool = simboluriAleatoare(n * 2 - 1);

    const simbolComun = pool[0];
    const simboluriCard1 = [simbolComun, ...pool.slice(1, n)];
    const simboluriCard2 = [simbolComun, ...pool.slice(n, n * 2 - 1)];
    const amesteca = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const card1 = Object.create(Card);
    card1.init(amesteca(simboluriCard1));

    const card2 = Object.create(Card);
    card2.init(amesteca(simboluriCard2));

    return { card1, card2, simbolComun };
  },

  imparte: async function () {
    const { card1, card2, simbolComun } = this.genereazaPereche();
    this.carduriCurente = [card1, card2];
    this.simbolComun = simbolComun;
  },

  start: async function () {
    if (!this.jucatori.length) return false;
    this.stare = 'playing';
    this.castigator = null;
    await this.imparte();
    return true;
  },

  handleClick: async function (jucator, simbol) {
    if (this.stare !== 'playing' || !this.simbolComun) return;

    if (simbol.name === this.simbolComun.name) {
      jucator.puncte++;

      if (this.onCorect) this.onCorect(jucator, simbol);

      if (jucator.puncte >= PUNCTE_CASTIG) {
        this.stare = 'ended';
        this.castigator = jucator;
        if (this.onCastig) this.onCastig(jucator);
        return;
      }
      this.carduriCurente.forEach((c) => c.reseteaza());
      await this.imparte();
    } else {
      if (this.onGresit) this.onGresit(jucator, simbol);
      simbol.selectat = false;
    }
  },

  reseteaza: async function () {
    await new Promise((resolve) => {
      this.stare = 'idle';
      this.carduriCurente = [];
      this.simbolComun = null;
      this.castigator = null;
      this.jucatori.forEach((j) => { j.puncte = 0; });
      resolve();
    });
  },
};
