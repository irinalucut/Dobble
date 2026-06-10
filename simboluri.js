// simboluri.js — toate simbolurile + selecție aleatoare

export const TOATE_SIMBOLURILE = [
  ['🌟', 'stea'], ['🔥', 'foc'], ['🌊', 'val'], ['🎯', 'tinta'], ['⚡', 'fulger'],
  ['🌈', 'curcubeu'], ['🌵', 'cactus'], ['🦋', 'fluture'], ['🎃', 'dovleac'], ['🔮', 'cristal'],
  ['🎸', 'chitara'], ['🚀', 'racheta'], ['💎', 'diamant'], ['🌙', 'luna'], ['🐉', 'dragon'],
  ['🦁', 'leu'], ['🌺', 'floare'], ['⚓', 'ancora'], ['🎭', 'teatru'], ['🏆', 'trofeu'],
  ['🦄', 'unicorn'], ['🍄', 'ciuperca'], ['🎨', 'paleta'], ['🌍', 'glob'], ['🧲', 'magnet'],
  ['🎲', 'zar'], ['🌻', 'soare'], ['🦊', 'vulpe'], ['🐬', 'delfin'], ['❤️', 'inima'],
  ['🎵', 'nota'], ['🌴', 'palmier'], ['🦅', 'vultur'], ['🍕', 'pizza'], ['🌋', 'vulcan'],
  ['🐙', 'caracatita'], ['💧', 'lacrima'], ['🦩', 'flamingo'], ['🍦', 'inghetata'], ['🎆', 'artificii'],
  ['🌠', 'stea2'], ['🧸', 'urs'], ['🦚', 'paun'], ['🎋', 'bambus'], ['🏄', 'surf'],
  ['🎻', 'vioara'], ['🔒', 'lacat'], ['🍳', 'ou'], ['🎡', 'roata'], ['🏔️', 'munte'],
  ['🎪', 'cort'], ['🥐', 'croissant'], ['🍪', 'cookie'], ['🍔', 'burger'],
].map(([emoji, name]) => ({ emoji, name }));

export function simboluriAleatoare(numar) {
  const lista = [...TOATE_SIMBOLURILE];
  // Fisher-Yates shuffle
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista.slice(0, numar);
}
