// Shuffle a copy so every ordering is equally likely without changing the email bank.
function shuffleEmails(emails, random = Math.random) {
  const shuffled = [...emails];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { shuffleEmails };
