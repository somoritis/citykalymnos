/* GDPR cookie consent banner + Google Consent Mode v2 update.
   Consent defaults to "denied" (set inline in <head> before gtag config).
   This script shows a banner; on Accept it updates consent to granted. */
(function () {
  function gtagUpdate(state) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  var choice = null;
  try { choice = localStorage.getItem('cookie_consent'); } catch (e) {}
  if (choice === 'granted') { gtagUpdate('granted'); return; }
  if (choice === 'denied') { return; }

  function strings() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    var d = {
      el: { m: 'Χρησιμοποιούμε cookies για ανάλυση επισκεψιμότητας (Google Analytics). Τα αναλυτικά cookies ενεργοποιούνται μόνο αν συμφωνήσετε.', a: 'Αποδοχή', r: 'Απόρριψη' },
      en: { m: 'We use cookies for traffic analytics (Google Analytics). Analytics cookies load only if you agree.', a: 'Accept', r: 'Decline' },
      de: { m: 'Wir verwenden Cookies zur Zugriffsanalyse (Google Analytics). Analyse-Cookies werden nur mit Ihrer Zustimmung geladen.', a: 'Akzeptieren', r: 'Ablehnen' },
      fr: { m: 'Nous utilisons des cookies pour l’analyse d’audience (Google Analytics). Ils ne sont chargés qu’avec votre accord.', a: 'Accepter', r: 'Refuser' },
      it: { m: 'Usiamo cookie per l’analisi del traffico (Google Analytics). Vengono caricati solo se acconsenti.', a: 'Accetta', r: 'Rifiuta' },
      tr: { m: 'Trafik analizi için çerez kullanıyoruz (Google Analytics). Analitik çerezler yalnızca onay verirseniz yüklenir.', a: 'Kabul et', r: 'Reddet' }
    };
    return d[l] || d.en;
  }

  function show() {
    if (!document.body) return;
    var s = strings();
    var bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'cookie consent');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0b3a53;color:#fff;padding:14px 18px;font-family:inherit;font-size:14px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 14px rgba(0,0,0,.25)';

    var msg = document.createElement('span');
    msg.textContent = s.m;
    msg.style.cssText = 'max-width:640px;line-height:1.45';

    var btnA = document.createElement('button');
    btnA.type = 'button';
    btnA.textContent = s.a;
    btnA.style.cssText = 'background:#e8b04b;color:#0b3a53;border:0;padding:9px 20px;border-radius:6px;font-weight:600;cursor:pointer;font-size:14px';

    var btnR = document.createElement('button');
    btnR.type = 'button';
    btnR.textContent = s.r;
    btnR.style.cssText = 'background:transparent;color:#fff;border:1px solid rgba(255,255,255,.6);padding:9px 20px;border-radius:6px;cursor:pointer;font-size:14px';

    btnA.onclick = function () {
      try { localStorage.setItem('cookie_consent', 'granted'); } catch (e) {}
      gtagUpdate('granted');
      bar.remove();
    };
    btnR.onclick = function () {
      try { localStorage.setItem('cookie_consent', 'denied'); } catch (e) {}
      bar.remove();
    };

    bar.appendChild(msg);
    bar.appendChild(btnA);
    bar.appendChild(btnR);
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
