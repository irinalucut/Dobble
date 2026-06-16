function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Computer = {
  activ: false,
  mod: 'easy',          
  jucator: null,
  _timer: null,
  _scanTimer: null,

  _incercate: new Set(),

  init: function (jucator, mod = 'easy') {
    this.activ = true;
    this.mod = mod;
    this.jucator = jucator;
    this._incercate = new Set();
  },

  resetRunda: function () {
    this._incercate = new Set();
  },

  reset: function () {
    this.activ = false;
    this.jucator = null;
    this.mod = 'easy';
    this._incercate = new Set();
    clearTimeout(this._timer);
    clearTimeout(this._scanTimer);
    this._timer = null;
    this._scanTimer = null;
  },

  anuleaza: function () {
    clearTimeout(this._timer);
    clearTimeout(this._scanTimer);
    this._timer = null;
    this._scanTimer = null;
  },

  planificaMutare: function (joc, onMutare) {
    if (!this.activ || joc.stare !== 'playing') return;
    this.anuleaza();

    if (this.mod === 'easy') {
      this._mutareEasy(joc, onMutare);
    } else {
      this._mutareMedium(joc, onMutare);
    }
  },

  _mutareEasy: function (joc, onMutare) {
    const delay = 1500 + Math.random() * 2500;

    this._timer = setTimeout(() => {
      if (!this.activ || joc.stare !== 'playing') return;

      const card = joc.carduriCurente[1];
      if (!card || !card.simboluri.length) return;

      const disponibile = card.simboluri.filter(s => !this._incercate.has(s.name));
      const pool = disponibile.length ? disponibile : card.simboluri;
      const ales = pool[Math.floor(Math.random() * pool.length)];

      this._incercate.add(ales.name);
      if (onMutare) onMutare(ales);
    }, delay);
  },

 
  _mutareMedium: function (joc, onMutare) {
    const MAX_MS   = 700 + Math.random() * 500;  
    const PAS_MS   = 50 + Math.random() * 70;    
    const ERR_RATE = 0.10;                        
    const startDelay = 250 + Math.random() * 200;

    this._timer = setTimeout(() => {
      if (!this.activ || joc.stare !== 'playing') return;

      const card1 = joc.carduriCurente[0]; 
      const card2 = joc.carduriCurente[1]; 
      if (!card1 || !card2) return;

      const sim1 = card1.simboluri;

      const sim2Amestecat = shuffle(card2.simboluri);

      const scoruri = sim2Amestecat.map((s) => ({ simbol: s, scor: 0 }));

      const startTime = Date.now();
      let i = 0; 
      let j = 0; 

      const pasUrmator = () => {
        if (!this.activ || joc.stare !== 'playing') return;

        const timpScurs = Date.now() - startTime;

  
        if (timpScurs >= MAX_MS || i >= sim2Amestecat.length) {
          const cel_mai_bun = scoruri.reduce((a, b) => (b.scor > a.scor ? b : a));

          let ales;
          if (Math.random() < ERR_RATE) {
         
            const gresiti = scoruri.filter(
              (c) => c.scor === 0 && !this._incercate.has(c.simbol.name)
            );
            ales = gresiti.length
              ? gresiti[Math.floor(Math.random() * gresiti.length)].simbol
              : cel_mai_bun.simbol; 
          } else {
            ales = cel_mai_bun.simbol;
          }

          this._incercate.add(ales.name);
          if (onMutare) onMutare(ales);
          return;
        }

        if (sim2Amestecat[i].name === sim1[j].name) {
          scoruri[i].scor = 100; 
          i = sim2Amestecat.length; 
        } else {
          j++;
          if (j >= sim1.length) {
            j = 0;
            i++;
          }
        }

        this._scanTimer = setTimeout(pasUrmator, PAS_MS);
      };

      pasUrmator();
    }, startDelay);
  },
};
