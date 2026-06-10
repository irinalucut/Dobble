// jucatori.js — starea jucătorilor + mesaje în interfață

export let jucatori = [];

export function seteazaJucatori(noiJucatori) {
  jucatori = noiJucatori;
}

export function mesaj(text) {
  const el = document.getElementById('mesaj');
  el.textContent = text;
  clearTimeout(mesaj._timer);
  mesaj._timer = setTimeout(() => {
    el.textContent = '';
  }, 3000);
}
