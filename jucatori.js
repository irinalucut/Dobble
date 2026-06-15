export let jucatori = [];

export function seteazaJucatori(noiJucatori) {
   jucatori = noiJucatori; 
  }

export function mesaj(text, durata = 3000) {
  const el = document.getElementById('mesaj');
  el.textContent = text;
  clearTimeout(mesaj._timer);
  if (durata > 0) mesaj._timer = setTimeout(() => { el.textContent = ''; }, durata);
}
