(() => {
  const audio = new Audio('assets/audio/backgroundMusic.mp3');
  audio.loop = true;
  audio.volume = 0.2;
  audio.preload = 'none';
  const read = key => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  };
  const save = (key, value) => {
    try { sessionStorage.setItem(key, String(value)); } catch { /* Music still works without storage. */ }
  };
  let enabled = read('music-enabled') !== 'false';
  const resumeTime = Number(read('music-position'));
  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(resumeTime) && resumeTime > 0 && Number.isFinite(audio.duration)) {
      audio.currentTime = resumeTime % audio.duration;
    }
  }, { once: true });

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-toggle';
  const icon = document.createElement('img');
  icon.alt = '';
  icon.width = 24;
  icon.height = 24;
  button.appendChild(icon);
  const item = document.createElement('li');
  item.appendChild(button);
  document.querySelector('.nav-list').appendChild(item);

  function update() {
    const label = enabled ? 'Mute music' : 'Unmute music';
    icon.src = enabled ? 'assets/images/music-note.svg' : 'assets/images/music-muted.svg';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.setAttribute('aria-pressed', String(!enabled));
  }
  async function play() {
    try { await audio.play(); } catch { /* A user gesture may be required on each page. */ }
    update();
  }
  button.addEventListener('click', () => {
    if (enabled) {
      enabled = false;
      audio.pause();
      save('music-enabled', false);
      update();
    } else {
      enabled = true;
      save('music-enabled', true);
      update();
      void play();
    }
  });
  document.addEventListener('click', event => {
    if (event.target.closest('.music-toggle')) return;
    if (enabled && audio.paused) {
      save('music-enabled', true);
      void play();
    }
  });
  window.addEventListener('pagehide', () => save('music-position', audio.currentTime));
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('error', () => {
    icon.src = 'assets/images/music-muted.svg';
    button.title = 'Music unavailable';
    button.setAttribute('aria-label', 'Music unavailable');
    button.disabled = true;
  });
  update();
  if (enabled) void play();
})();
