/* Visible FAQ accordion, generated from the page's own FAQPage JSON-LD.
   Keeps visible content identical to the structured data, in every language.
   Safe: does nothing if the page has no FAQPage schema or already shows a #faq section. */
(function () {
  function headings() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    var d = {
      el: 'Συχνές ερωτήσεις',
      en: 'Frequently asked questions',
      de: 'Häufige Fragen',
      fr: 'Questions fréquentes',
      it: 'Domande frequenti',
      tr: 'Sıkça sorulan sorular'
    };
    return d[l] || d.en;
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

  function build() {
    if (document.getElementById('faq')) return;          // already has a visible FAQ
    var qas = getQAs();
    if (!qas.length) return;

    var sec = document.createElement('section');
    sec.id = 'faq';
    sec.style.cssText = 'max-width:900px;margin:48px auto;padding:0 20px;';

    var h = document.createElement('h2');
    h.textContent = headings();
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
