/* Two small jobs, both driven by the page's own language:
   1. Point the footer "how to get to Kalymnos" link at the matching language version.
   2. Render a visible FAQ accordion from the page's own FAQPage JSON-LD,
      so the visible content always matches the structured data.
   Safe: does nothing if the page has no FAQPage schema or already shows a #faq section. */
(function () {

  function lang() {
    return (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  }

  /* ---------- 1. localise the how-to link ---------- */
  function fixHowToLinks() {
    var l = lang();
    if (l === 'el') return;                       // Greek page already points to the Greek version
    var known = ['en', 'de', 'fr', 'it', 'tr'];
    if (known.indexOf(l) === -1) return;
    var target = '/' + l + '/how-to-get-to-kalymnos.html';
    var links = document.querySelectorAll('a[href$="/how-to-get-to-kalymnos.html"], a[href="how-to-get-to-kalymnos.html"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      // only rewrite links that still point at the root (Greek) version
      if (/^(https?:\/\/[^/]+)?\/?how-to-get-to-kalymnos\.html$/.test(href)) {
        links[i].setAttribute('href', target);
      }
    }
  }

  /* ---------- 2. visible FAQ from the page's schema ---------- */
  function heading() {
    var d = {
      el: 'Συχνές ερωτήσεις',
      en: 'Frequently asked questions',
      de: 'Häufige Fragen',
      fr: 'Questions fréquentes',
      it: 'Domande frequenti',
      tr: 'Sıkça sorulan sorular'
    };
    return d[lang()] || d.en;
  }

  function getQAs() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      var data;
      try { data = JSON.parse(scripts[i].textContent); } catch (e) { continue; }
      var items = [].concat(data);
      for (var j = 0; j < items.length; j++) {
        var o = items[j];
        if (o && o['@type'] === 'FAQPage' && Array.isArray(o.mainEntity)) {
          return o.mainEntity.map(function (q) {
            var a = q.acceptedAnswer || {};
            return { q: q.name || '', a: a.text || '' };
          }).filter(function (x) { return x.q && x.a; });
        }
      }
    }
    return [];
  }

  function buildFAQ() {
    if (document.getElementById('faq')) return;   // page already shows a visible FAQ
    var qas = getQAs();
    if (!qas.length) return;

    var sec = document.createElement('section');
    sec.id = 'faq';
    sec.style.cssText = 'max-width:900px;margin:48px auto;padding:0 20px;';

    var h = document.createElement('h2');
    h.textContent = heading();
    h.style.cssText = 'text-align:center;color:#0b3a53;margin-bottom:14px;';
    sec.appendChild(h);

    qas.forEach(function (item) {
      var det = document.createElement('details');
      det.style.cssText = 'border-bottom:1px solid #d8e6ef;padding:14px 4px;';

      var sum = document.createElement('summary');
      sum.textContent = item.q;
      sum.style.cssText = 'cursor:pointer;font-weight:600;color:#0b3a53;';

      var p = document.createElement('p');
      p.textContent = item.a;
      p.style.cssText = 'margin:10px 0 0;color:#33555f;line-height:1.6;';

      det.appendChild(sum);
      det.appendChild(p);
      sec.appendChild(det);
    });

    var footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(sec, footer);
    } else {
      document.body.appendChild(sec);
    }
  }

  function run() {
    try { fixHowToLinks(); } catch (e) {}
    try { buildFAQ(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
