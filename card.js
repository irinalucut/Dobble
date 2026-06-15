export const Card = {
  simboluri: [], x: 0, y: 0, raza: 155,
  init: function (simboluri) {
    this.simboluri = simboluri.map((s) => ({
      emoji: s.emoji, name: s.name, x: 0, y: 0,
      size: 40, rotatie: Math.random() * 360, selectat: false,
    }));
  },
  asazaSimboluri: function () {
    const primul = this.simboluri[0];
    primul.x = this.x; 
    primul.y = this.y;

    const restul = this.simboluri.slice(1);
    const razaOrbit = this.raza * 0.63;
    restul.forEach((sim, i) => {
      const unghi = (i / restul.length) * Math.PI * 2 - Math.PI / 2;
      sim.x = this.x + Math.cos(unghi) * razaOrbit;
      sim.y = this.y + Math.sin(unghi) * razaOrbit;
    });
  },
  seteazaPozitie: function (x, y) { 
    this.x = x; 
    this.y = y; 
    this.asazaSimboluri(); },
  deseneaza: function () {
    fill(255); stroke(200); strokeWeight(2);
    circle(this.x, this.y, this.raza * 2);
    this.simboluri.forEach((sim) => {
      push(); 
      translate(sim.x, sim.y); 
      rotate(radians(sim.rotatie * 0.07));

      if (sim.selectat) { noStroke(); fill('rgba(244,208,63,0.4)'); circle(0, 0, sim.size * 1.7); }
      textAlign(CENTER, CENTER); textSize(sim.size); noStroke();
      text(sim.emoji, 0, 0); pop();
    });
  },
  clicat: function (mx, my) {
    for (const sim of this.simboluri) {
      const j = sim.size / 2;
      if (
        mx >= sim.x - j && mx <= sim.x + j &&
        my >= sim.y - j && my <= sim.y + j
        ) {
        sim.selectat = !sim.selectat; 
        return sim;
      }
    }
    return null;
  },
  areSimbol: function (name) { return this.simboluri.some((s) => s.name === name); },
  gasesteComunul: function (altCard) { return this.simboluri.find((s) => altCard.areSimbol(s.name)) || null; },
  reseteaza: function () { this.simboluri.forEach((s) => { s.selectat = false; }); },
};
