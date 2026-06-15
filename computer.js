export const Computer = {
  activ: false,
  jucator: null,        
  _timer: null,

  init: function (jucator) {
    this.activ = true;
    this.jucator = jucator;
  },

  reset: function () {
    this.activ = false;
    this.jucator = null;
    clearTimeout(this._timer);
    this._timer = null;
  },

 
  planificaMutare: function (joc, onMutare) {
    if (!this.activ || joc.stare !== 'playing') return;

    clearTimeout(this._timer);

    const delay = 1500 + Math.random() * 2500; // 1.5s - 4s

    this._timer = setTimeout(() => {
      if (!this.activ || joc.stare !== 'playing') return;

      const card = joc.carduriCurente[1];
      if (!card || !card.simboluri.length) return;

      const simboluri = card.simboluri;
      const ales = simboluri[Math.floor(Math.random() * simboluri.length)];

      if (onMutare) onMutare(ales);
    }, delay);
  },

  anuleaza: function () {
    clearTimeout(this._timer);
    this._timer = null;
  },
};
