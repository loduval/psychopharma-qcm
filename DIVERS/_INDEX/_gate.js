// Protection mot de passe simple (hash SHA-256 côté client)
(function(){
  var EXPECTED_HASH = 'a37697089478f2e1e0ef3deb433c656446887c0381bfd1a8199062963e7f659f';
  var KEY = 'qcm_psychopharma_auth_v1';
  
  // Skip si déjà authentifié dans cette session
  if (sessionStorage.getItem(KEY) === 'ok') return;
  
  // Cacher le body pendant la vérification
  document.documentElement.style.visibility = 'hidden';
  
  async function sha256(s) {
    var buf = new TextEncoder().encode(s);
    var hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2,'0')).join('');
  }
  
  document.addEventListener('DOMContentLoaded', async function() {
    var pwd = prompt('🔒 Accès protégé — Mot de passe :');
    if (!pwd) { document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif;color:#888;">Accès annulé.</p>'; document.documentElement.style.visibility = 'visible'; return; }
    var hash = await sha256(pwd);
    if (hash === EXPECTED_HASH) {
      sessionStorage.setItem(KEY, 'ok');
      document.documentElement.style.visibility = 'visible';
    } else {
      document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif;color:#e57;">❌ Mot de passe incorrect. Rechargez la page pour réessayer.</p>';
      document.documentElement.style.visibility = 'visible';
    }
  });
})();
