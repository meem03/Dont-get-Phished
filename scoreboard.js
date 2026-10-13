async function loadScoreboard() {
  const status = document.getElementById('leaderboard-status');
  status.textContent = 'Loading scores…';
  try {
    const response = await fetch('/.netlify/functions/scoreboard');
    if (!response.ok) throw new Error('Scoreboard unavailable');
    const scores = await response.json();
    const tbody = document.getElementById('leaderboard-body');
    tbody.replaceChildren();
    scores.forEach((player, index) => {
      const row = document.createElement('tr');
      if (index < 3) row.classList.add(`top-${index + 1}`);
      for (const value of [index + 1, player.name, player.score]) {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    });
    status.textContent = scores.length ? '' : 'No scores yet. Be the first to play!';
  } catch {
    status.textContent = 'The scoreboard is unavailable. Please try again later.';
  }
}
loadScoreboard();
