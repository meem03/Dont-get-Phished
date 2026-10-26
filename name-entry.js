const nameForm = document.getElementById('nameForm');
const nameField = document.getElementById('userName');
const nameStatus = document.getElementById('nameStatus');
const nameKey = value => value.normalize('NFKC').trim().toLowerCase();
nameForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = nameField.value.normalize('NFKC').trim();
  if (!name || name.length > 20 || !/^[\p{L}\p{M}\p{N} ._'\-]+$/u.test(name)) {
    nameStatus.textContent = 'Use 1–20 characters: letters, numbers, spaces, or . _ - and apostrophes.';
    nameField.focus();
    return;
  }
  const button = nameForm.querySelector('button[type=submit]');
  button.disabled = true;
  nameStatus.textContent = 'Checking name…';
  try {
    const response = await fetch('/.netlify/functions/scoreboard', { cache: 'no-store' });
    if (!response.ok) throw new Error('Name check unavailable');
    const scores = await response.json();
    const taken = new Set(scores.map(player => nameKey(player.name)));
    if (taken.has(nameKey(name))) {
      let number = 2;
      let suggestion;
      do { const suffix = `-${number++}`; suggestion = name.slice(0, 20 - suffix.length) + suffix; }
      while (taken.has(nameKey(suggestion)));
      nameField.value = suggestion;
      nameStatus.textContent = `“${name}” is taken. Try “${suggestion}” or choose another name, then press Play.`;
      nameField.focus();
      return;
    }
  } catch {
    const local = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (!local) {
      nameStatus.textContent = 'Could not check your name. Please try again.';
      return;
    }
    // Static previews cannot access the bin; the deployed game checks names.
  } finally {
    button.disabled = false;
  }
  localStorage.setItem('userName', name);
  location.href = 'play.html';
});
