export const Buton = {
  x: 0, y: 0, width: 0, height: 0, culoare: '', eticheta: '',
  init: function (x, y, width, height, culoare, eticheta) {
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.culoare = culoare; this.eticheta = eticheta;
  },
  deseneaza: function () {
    fill(this.culoare); noStroke();
    rect(this.x, this.y, this.width, this.height, 8);
    fill(255); textAlign(CENTER, CENTER); textSize(14);
    text(this.eticheta, this.x + this.width / 2, this.y + this.height / 2);
  },
  esteClicat: function (mx, my, callback) {
    if (mx >= this.x && mx <= this.x + this.width &&
      my >= this.y && my <= this.y + this.height)
      callback();
  },
};
