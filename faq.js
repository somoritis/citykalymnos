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

  /* ---------- 1b. add the climbing guide next to the how-to link ---------- */
  function climbText() {
    var d = {
      el: 'Αναρρίχηση στην Κάλυμνο',
      en: 'Climbing in Kalymnos',
      de: 'Klettern auf Kalymnos',
      fr: 'Escalade à Kalymnos',
      it: 'Arrampicata a Kalymnos',
      tr: "Kalymnos'ta tırmanış"
    };
    return d[lang()] || d.en;
  }

  function climbSub() {
    var d = {
      el: '4.500+ διαδρομές — και πού να μείνετε',
      en: '4,500+ routes — and where to stay',
      de: '4.500+ Routen — und wo man wohnt',
      fr: '4 500+ voies — et où loger',
      it: '4.500+ vie — e dove dormire',
      tr: "4.500+ rota — ve nerede kalmalı"
    };
    return d[lang()] || d.en;
  }

  function addClimbLink() {
    if (document.querySelector('a[href*="kalymnos-climbing-accommodation"]')) return;
    var l = lang();
    var known = ['el', 'en', 'de', 'fr', 'it', 'tr'];
    if (known.indexOf(l) === -1) return;
    var target = (l === 'el' ? '/' : '/' + l + '/') + 'kalymnos-climbing-accommodation.html';

    var ref = document.querySelector('footer a[href*="how-to-get-to-kalymnos"]');
    if (!ref || !ref.parentNode) return;

    var a = document.createElement('a');
    a.href = target;
    a.textContent = climbText();
    var small = document.createElement('span');
    small.textContent = climbSub();
    small.style.cssText = 'display:block;font-size:.85em;opacity:.8;';

    // mirror whatever wrapper the how-to link already sits in
    var host = ref.parentNode;
    if (host.tagName === 'FOOTER' || host.children.length > 3) {
      ref.insertAdjacentElement('afterend', a);
      a.insertAdjacentElement('afterend', small);
    } else {
      var clone = host.cloneNode(false);
      clone.appendChild(a);
      clone.appendChild(small);
      host.insertAdjacentElement('afterend', clone);
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
  var TRANSLATIONS = {
        el: [
              {q:"Είναι τα καταλύματα κατάλληλα για αναρριχητές;", a:"Ναι. Η Κάλυμνος έχει πάνω από 4.500 αθλητικές διαδρομές και τα διαμερίσματά μας βρίσκονται στην Πόθια, στο λιμάνι όπου φτάνουν τα πλοία — 9 χλμ. από το Μασούρι, 20 με 30 λεπτά με μηχανάκι ή αυτοκίνητο. Γράψαμε αναλυτικό οδηγό με τους τομείς, τις εποχές, τον εξοπλισμό και μια ειλικρινή σύγκριση Μασουριού και Πόθιας: https://citystonehouseskalymnos.gr/kalymnos-climbing-accommodation.html"},
                    {q:"Υπάρχουν ειδικές τιμές για κάποιες κατηγορίες επισκεπτών;", a:"Ναι. Καλύτερες τιμές ισχύουν για: οικογένειες Καλυμνίων που ζουν μόνιμα εκτός Καλύμνου, οικογένειες με παιδιά, επισκέπτες που ξανακλείνουν για τους ίδιους ή για συγγενείς και φίλους, διαμονές άνω των 7 ημερών, άτομα με ειδικές ανάγκες, κρατήσεις και των δύο σπιτιών μαζί, επισκέψεις για λόγους υγείας, καθώς και αναρριχητές ή κρατήσεις εκτός σεζόν. Επικοινωνήστε μαζί μας για προσφορά."},
                          {q:"Πού βρίσκονται τα City Stone Houses;", a:"Στην Πόθια, στο λιμάνι της Καλύμνου, στην καρδιά του νησιού. Σε ακτίνα 30–100 μέτρων υπάρχουν εστιατόρια, καφέ, σούπερ μάρκετ, φούρνος, φαρμακεία, μουσεία και στάση ταξί/λεωφορείου."},
                                {q:"Τι ώρα είναι το check-in και το check-out και πώς μπαίνω;", a:"Check-in από τις 15:00 και check-out έως τις 11:00. Το check-in είναι ανέπαφο (self check-in) μέσω κλειδοθήκης, οπότε φτάνετε όποια ώρα σας βολεύει."},
                                      {q:"Πόσο μακριά είναι η παραλία;", a:"Η παραλία Βουβάλη είναι 3–5 λεπτά με τα πόδια και η παραλία Κασόνια 5–10 λεπτά προς την άλλη κατεύθυνση."},
                                            {q:"Πώς φτάνω στην Κάλυμνο από Κω, Ρόδο ή Bodrum;", a:"Η Κάλυμνος συνδέεται ακτοπλοϊκά με Κω, Ρόδο και τα υπόλοιπα Δωδεκάνησα, καθώς και εποχιακά με την περιοχή του Bodrum (Τουρκία). Τα διαμερίσματα βρίσκονται δίπλα στο λιμάνι της Πόθιας, όπου φτάνουν τα πλοία."},
                                                  {q:"Πόσα άτομα χωράνε και τι παροχές έχουν;", a:"Κάθε διαμέρισμα φιλοξενεί έως 5 άτομα, με 2 υπνοδωμάτια, πλήρη κουζίνα, Wi-Fi, κλιματισμό, πλυντήριο, τηλεόραση και βρεφικό κρεβάτι. Το House 2 (ισόγειο) έχει επιπλέον ιδιωτική αυλή και BBQ."},
                                                        {q:"Είναι κατάλληλα για αναρριχητές και για οικογένειες;", a:"Ναι. Η κεντρική τοποθεσία στην Πόθια είναι βολική βάση τόσο για αναρριχητές που εξερευνούν τα πεδία της Καλύμνου όσο και για οικογένειες και παρέες, με όλες τις ανέσεις σε κοντινή απόσταση."}
        ],
            en: [
                  {q:"Are the apartments suitable for climbers?", a:"Yes. Kalymnos has more than 4,500 sport climbing routes, and our apartments are in Pothia, the port where the ferries arrive — 9 km from Masouri, a 20 to 30 minute ride by scooter or car. We wrote a full guide covering the sectors, the seasons, the gear and an honest Masouri versus Pothia comparison: https://citystonehouseskalymnos.gr/en/kalymnos-climbing-accommodation.html"},
                        {q:"Are there special rates for certain types of guests?", a:"Yes. Better rates apply to: families of Kalymnians living permanently off the island, families with children, returning guests booking again for themselves or for relatives and friends, stays longer than 7 days, guests with special needs, bookings of both houses together, visits for medical reasons, and climbers or off-season bookings. Contact us for a quote."},
                              {q:"Where are the City Stone Houses located?", a:"In Pothia, at the harbour of Kalymnos, in the heart of the island. Within 30–100 metres you will find restaurants, cafés, a supermarket, a bakery, pharmacies, museums and a taxi/bus stop."},
                                    {q:"What are the check-in and check-out times, and how do I get in?", a:"Check-in is from 15:00 and check-out is by 11:00. Check-in is contactless (self check-in) via a key box, so you can arrive at any time that suits you."},
                                          {q:"How far is the beach?", a:"Vouvali beach is a 3–5 minute walk away, and Kasonia beach is 5–10 minutes in the other direction."},
                                          {q:"How do I get to Kalymnos from Kos, Rhodes or Bodrum?", a:"Kalymnos is connected by ferry with Kos, Rhodes and the other Dodecanese islands, as well as seasonally with the Bodrum area in Turkey. The apartments are right by Pothia harbour, where the ferries arrive."},
                                                {q:"How many guests fit and what amenities are included?", a:"Each apartment sleeps up to 5 guests and has 2 bedrooms, a full kitchen, Wi-Fi, air conditioning, a washing machine, a TV and a baby cot. House 2 (ground floor) additionally has a private yard and BBQ."},
                                                      {q:"Are the apartments suitable for climbers and for families?", a:"Yes. The central location in Pothia is a convenient base both for climbers exploring the Kalymnos crags and for families and groups, with all conveniences within walking distance."}
                                                          ],
                                                              de: [
                                                                    {q:"Sind die Apartments für Kletterer geeignet?", a:"Ja. Kalymnos hat mehr als 4.500 Sportkletterrouten, und unsere Apartments liegen in Pothia, dem Hafen, in dem die Fähren ankommen — 9 km von Masouri, 20 bis 30 Minuten mit Roller oder Auto. Wir haben einen ausführlichen Leitfaden geschrieben: Sektoren, Jahreszeiten, Ausrüstung und ein ehrlicher Vergleich zwischen Masouri und Pothia: https://citystonehouseskalymnos.gr/de/kalymnos-climbing-accommodation.html"},
                                                                          {q:"Gibt es Sonderpreise für bestimmte Gästegruppen?", a:"Ja. Bessere Preise gelten für: Familien von Kalymniern, die dauerhaft außerhalb der Insel leben, Familien mit Kindern, wiederkehrende Gäste, die erneut für sich oder für Verwandte und Freunde buchen, Aufenthalte über 7 Tage, Gäste mit besonderen Bedürfnissen, Buchungen beider Häuser zusammen, Besuche aus gesundheitlichen Gründen sowie Kletterer und Buchungen außerhalb der Hauptsaison. Kontaktieren Sie uns für ein Angebot."},
                                                                                {q:"Wo befinden sich die City Stone Houses?", a:"In Pothia, am Hafen von Kalymnos, im Herzen der Insel. In einem Umkreis von 30–100 Metern finden Sie Restaurants, Cafés, einen Supermarkt, eine Bäckerei, Apotheken, Museen sowie eine Taxi- und Bushaltestelle."},
                                                                                      {q:"Wann sind Check-in und Check-out und wie komme ich hinein?", a:"Check-in ist ab 15:00 Uhr und Check-out bis 11:00 Uhr. Der Check-in erfolgt kontaktlos (Self-Check-in) über eine Schlüsselbox, sodass Sie zu jeder passenden Uhrzeit anreisen können."},
                                                                                            {q:"Wie weit ist der Strand entfernt?", a:"Der Strand Vouvali ist 3–5 Gehminuten entfernt, der Strand Kasonia 5–10 Minuten in die andere Richtung."},
                                                                                                  {q:"Wie komme ich von Kos, Rhodos oder Bodrum nach Kalymnos?", a:"Kalymnos ist per Fähre mit Kos, Rhodos und den übrigen Dodekanes-Inseln verbunden sowie saisonal mit der Region Bodrum in der Türkei. Die Apartments liegen direkt am Hafen von Pothia, wo die Fähren ankommen."},
                                                                                                        {q:"Für wie viele Gäste ist Platz und welche Ausstattung gibt es?", a:"Jedes Apartment bietet Platz für bis zu 5 Gäste und verfügt über 2 Schlafzimmer, eine voll ausgestattete Küche, WLAN, Klimaanlage, Waschmaschine, TV und ein Babybett. House 2 (Erdgeschoss) hat zusätzlich einen privaten Innenhof und einen Grill."},
                                                                                                              {q:"Sind die Apartments für Kletterer und Familien geeignet?", a:"Ja. Die zentrale Lage in Pothia ist eine praktische Basis sowohl für Kletterer, die die Klettergebiete von Kalymnos erkunden, als auch für Familien und Gruppen – alle Annehmlichkeiten sind fußläufig erreichbar."}
                                                                                                                  ],
                                                                                                                      fr: [
                                                                                                                              {q:"Les appartements conviennent-ils aux grimpeurs ?", a:"Oui. Kalymnos compte plus de 4 500 voies d'escalade sportive, et nos appartements se trouvent à Pothia, le port où arrivent les ferries — à 9 km de Masouri, soit 20 à 30 minutes en scooter ou en voiture. Nous avons écrit un guide complet : secteurs, saisons, matériel et une comparaison honnête entre Masouri et Pothia : https://citystonehouseskalymnos.gr/fr/kalymnos-climbing-accommodation.html"},
                                                                                                                                    {q:"Existe-t-il des tarifs spéciaux pour certaines catégories de voyageurs ?", a:"Oui. Des tarifs préférentiels s'appliquent aux familles de Kalymniens vivant hors de l'île, aux familles avec enfants, aux clients qui réservent à nouveau pour eux-mêmes ou pour leurs proches et amis, aux séjours de plus de 7 jours, aux personnes à besoins spécifiques, aux réservations des deux maisons ensemble, aux visites pour raisons médicales, ainsi qu'aux grimpeurs et aux réservations hors saison. Contactez-nous pour un devis."},
                                                                                                                                          {q:"Où se trouvent les City Stone Houses ?", a:"À Pothia, sur le port de Kalymnos, au cœur de l'île. Dans un rayon de 30 à 100 mètres, vous trouverez des restaurants, des cafés, un supermarché, une boulangerie, des pharmacies, des musées ainsi qu'un arrêt de taxi et de bus."},
                                                                                                                                                {q:"Quels sont les horaires d'arrivée et de départ, et comment entrer ?", a:"L'arrivée se fait à partir de 15h00 et le départ jusqu'à 11h00. L'arrivée est sans contact (self check-in) via une boîte à clés, vous pouvez donc arriver à l'heure qui vous convient."},
                                                                                                                                                      {q:"À quelle distance se trouve la plage ?", a:"La plage de Vouvali est à 3–5 minutes à pied, et la plage de Kasonia à 5–10 minutes dans l'autre direction."},
                                                                                                                                                            {q:"Comment rejoindre Kalymnos depuis Kos, Rhodes ou Bodrum ?", a:"Kalymnos est reliée par ferry à Kos, Rhodes et aux autres îles du Dodécanèse, ainsi que de façon saisonnière à la région de Bodrum en Turquie. Les appartements se trouvent juste à côté du port de Pothia, où arrivent les ferries."},
                                                                                                                                                                  {q:"Combien de personnes peuvent loger et quels équipements sont inclus ?", a:"Chaque appartement accueille jusqu'à 5 personnes et dispose de 2 chambres, d'une cuisine entièrement équipée, du Wi-Fi, de la climatisation, d'un lave-linge, d'une télévision et d'un lit bébé. La House 2 (rez-de-chaussée) dispose en plus d'une cour privée et d'un barbecue."},
                                                                                                                                                                        {q:"Les appartements conviennent-ils aux grimpeurs et aux familles ?", a:"Oui. L'emplacement central à Pothia constitue une base pratique aussi bien pour les grimpeurs qui explorent les falaises de Kalymnos que pour les familles et les groupes, avec toutes les commodités à proximité immédiate."}
                                                                                                                                                                            ],
                                                                                                                                                                                it: [
                                                                                                                                                                                      {q:"Gli appartamenti sono adatti agli arrampicatori?", a:"Sì. Kalymnos ha più di 4.500 vie di arrampicata sportiva e i nostri appartamenti si trovano a Pothia, il porto dove arrivano i traghetti — a 9 km da Masouri, 20-30 minuti in scooter o in auto. Abbiamo scritto una guida completa: settori, stagioni, materiale e un confronto onesto tra Masouri e Pothia: https://citystonehouseskalymnos.gr/it/kalymnos-climbing-accommodation.html"},
                                                                                                                                                                                            {q:"Ci sono tariffe speciali per alcune categorie di ospiti?", a:"Sì. Tariffe migliori si applicano a famiglie di kalymniani che vivono stabilmente fuori dall'isola, famiglie con bambini, ospiti che prenotano di nuovo per sé o per parenti e amici, soggiorni superiori a 7 giorni, persone con esigenze speciali, prenotazioni di entrambe le case insieme, visite per motivi di salute, nonché arrampicatori e prenotazioni fuori stagione. Contattateci per un preventivo."},
                                                                                                                                                                                                  {q:"Dove si trovano le City Stone Houses?", a:"A Pothia, sul porto di Kalymnos, nel cuore dell'isola. Entro 30–100 metri troverete ristoranti, caffè, un supermercato, un forno, farmacie, musei e una fermata di taxi e autobus."},
                                                                                                                                                                                                        {q:"Quali sono gli orari di check-in e check-out e come si entra?", a:"Il check-in è dalle 15:00 e il check-out entro le 11:00. Il check-in è senza contatto (self check-in) tramite una cassetta portachiavi, quindi potete arrivare all'ora che preferite."},
                                                                                                                                                                                                              {q:"Quanto dista la spiaggia?", a:"La spiaggia di Vouvali è a 3–5 minuti a piedi, mentre la spiaggia di Kasonia a 5–10 minuti nell'altra direzione."},
                                                                                                                                                                                                                    {q:"Come si arriva a Kalymnos da Kos, Rodi o Bodrum?", a:"Kalymnos è collegata via traghetto con Kos, Rodi e le altre isole del Dodecaneso, oltre che stagionalmente con la zona di Bodrum in Turchia. Gli appartamenti si trovano proprio accanto al porto di Pothia, dove arrivano i traghetti."},
                                                                                                                                                                                                                          {q:"Quante persone possono alloggiare e quali servizi sono inclusi?", a:"Ogni appartamento ospita fino a 5 persone e dispone di 2 camere da letto, cucina completa, Wi-Fi, aria condizionata, lavatrice, TV e culla. La House 2 (piano terra) ha inoltre un cortile privato e un barbecue."},
                                                                                                                                                                                                                                {q:"Gli appartamenti sono adatti ad arrampicatori e famiglie?", a:"Sì. La posizione centrale a Pothia è una base comoda sia per gli arrampicatori che esplorano le falesie di Kalymnos sia per famiglie e gruppi, con tutti i servizi a pochi passi."}
                                                                                                                                                                                                                                    ],
                                                                                                                                                                                                                                        tr: [
                                                                                                                                                                                                                                              {q:"Daireler tırmanıcılar için uygun mu?", a:"Evet. Kalymnos'ta 4.500'den fazla spor tırmanış rotası var ve dairelerimiz feribotların yanaştığı liman olan Pothia'da bulunuyor — Masouri'ye 9 km, scooter veya arabayla 20-30 dakika. Sektörler, sezonlar, malzeme ve dürüst bir Masouri-Pothia karşılaştırması içeren ayrıntılı bir rehber yazdık: https://citystonehouseskalymnos.gr/tr/kalymnos-climbing-accommodation.html"},
                                                                                                                                                                                                                                                    {q:"Bazı misafir grupları için özel fiyatlar var mı?", a:"Evet. Daha iyi fiyatlar şunlar için geçerlidir: adanın dışında sürekli yaşayan Kalymnos kökenli aileler, çocuklu aileler, kendisi ya da akraba ve arkadaşları için tekrar rezervasyon yapan misafirler, 7 günden uzun konaklamalar, özel gereksinimli misafirler, iki evin birlikte kiralanması, sağlık nedeniyle yapılan ziyaretler ile tırmanışçılar ve sezon dışı rezervasyonlar. Teklif için bize ulaşın."},
                                                                                                                                                                                                                                                          {q:"City Stone Houses nerede bulunuyor?", a:"Kalimnos'un limanı Pothia'da, adanın kalbinde yer alır. 30–100 metre yarıçapında restoranlar, kafeler, market, fırın, eczaneler, müzeler ile taksi ve otobüs durağı bulunur."},
                                                                                                                                                                                                                                                                {q:"Giriş ve çıkış saatleri nedir, içeri nasıl girerim?", a:"Giriş saat 15:00'ten itibaren, çıkış ise 11:00'e kadardır. Giriş, anahtar kutusu ile temassızdır (self check-in), böylece size uygun herhangi bir saatte gelebilirsiniz."},
                                                                                                                                                                                                                                                                      {q:"Plaj ne kadar uzaklıkta?", a:"Vouvali plajı yürüyerek 3–5 dakika, Kasonia plajı ise diğer yönde 5–10 dakika mesafededir."},
                                                                                                                                                                                                                                                                            {q:"Kalimnos'a Kos, Rodos veya Bodrum'dan nasıl giderim?", a:"Kalimnos; Kos, Rodos ve diğer On İki Ada'ya feribotla, ayrıca sezonluk olarak Türkiye'deki Bodrum bölgesine bağlıdır. Daireler, feribotların yanaştığı Pothia limanının hemen yanındadır."},
                                                                                                                                                                                                                                                                                  {q:"Kaç kişi kalabilir ve hangi olanaklar mevcut?", a:"Her daire en fazla 5 kişi ağırlar; 2 yatak odası, tam donanımlı mutfak, Wi-Fi, klima, çamaşır makinesi, TV ve bebek yatağı bulunur. House 2 (zemin kat) ayrıca özel avlu ve barbeküye sahiptir."},
                                                                                                                                                                                                                                                                                        {q:"Daireler tırmanışçılar ve aileler için uygun mu?", a:"Evet. Pothia'daki merkezi konum, hem Kalimnos kaya tırmanışı bölgelerini keşfeden tırmanışçılar hem de aileler ve gruplar için elverişli bir üstür; tüm olanaklar yürüme mesafesindedir."}
                                                                                                                                                                                                                                                                                            ]
                                                                                                                                                                                                                                                                                    
                                                                                                                  
  };
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
  var existing = document.getElementById('faq');
    if (existing && !existing.getAttribute('data-auto')) return;   // hand-built FAQ already on page
      var qas = getQAs();
        if (!qas.length) return;
          var t = TRANSLATIONS[lang()];
            if (t && t.length === qas.length) qas = t;
              if (existing) existing.remove();

    var sec = document.createElement('section');
    sec.id = 'faq';
    sec.setAttribute('data-auto', '1');
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
      p.style.cssText = 'margin:10px 0 0;color:#33555f;line-height:1.6;';
      /* turn any plain http(s) address in the answer into a real link */
      var parts = String(item.a).split(/(https?:\/\/[^\s<>"']+)/g);
      for (var k = 0; k < parts.length; k++) {
        var chunk = parts[k];
        if (/^https?:\/\//.test(chunk)) {
          var a = document.createElement('a');
          a.href = chunk;
          a.textContent = chunk.replace(/^https?:\/\//, '').replace(/\/$/, '');
          a.style.cssText = 'color:#1f6f9c;';
          p.appendChild(a);
        } else if (chunk) {
          p.appendChild(document.createTextNode(chunk));
        }
      }
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
    try { addClimbLink(); } catch (e) {}
    try { buildFAQ(); } catch (e) {}
    try {
      var mo = new MutationObserver(function () { try { buildFAQ(); } catch (e) {} });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
