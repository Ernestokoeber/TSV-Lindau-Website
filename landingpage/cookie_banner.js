// Cookie_Banner Logik

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const btnAcceptAll = document.getElementById('cookie-accept-all');
  const btnSaveSelection = document.getElementById('cookie-save-selection');
  const btnOnlyNecessary = document.getElementById('cookie-only-necessary');

  const cbFunctional = document.getElementById('cookie-functional');
  const cbAnalytics = document.getElementById('cookie-analytics');
  const cbMarketing = document.getElementById('cookie-marketing');

  const settingsButton = document.getElementById('cookie-settings-button');

  // Bereits erteilte Einwilligung auslesen
  const storedConsent = localStorage.getItem('cookieConsent');

  if (storedConsent) {
    const consent = JSON.parse(storedConsent);
    // Checkboxes nachladen (falls User Einstellungen erneut sehen will)
    cbFunctional.checked = !!consent.functional;
    cbAnalytics.checked = !!consent.analytics;
    cbMarketing.checked = !!consent.marketing;
    banner.classList.add('hidden');
    applyConsent(consent);
  } else {
    // Keine Einwilligung vorhanden -> Banner anzeigen
    banner.classList.remove('hidden');
  }

  btnAcceptAll.addEventListener('click', () => {
    const consent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
  });

  btnSaveSelection.addEventListener('click', () => {
    const consent = {
      necessary: true,
      functional: cbFunctional.checked,
      analytics: cbAnalytics.checked,
      marketing: cbMarketing.checked,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
  });

  btnOnlyNecessary.addEventListener('click', () => {
    const consent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    saveConsent(consent);
  });

  settingsButton.addEventListener('click', () => {
    banner.classList.remove('hidden');
  });

  function saveConsent(consent) {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    banner.classList.add('hidden');
    applyConsent(consent);
  }

  /**
   * Hier entscheidest du, welche Skripte/Dienste geladen werden dürfen.
   * Du musst deine Tracking- und Drittanbieter-Skripte so einbauen,
   * dass sie erst NACH Einwilligung aktiviert werden.
   */
  function applyConsent(consent) {
    // Beispiel-Struktur: Du kannst deine Skripte mit data-Attributen versehen
    // und hier selektiv nachladen/aktivieren.

    // Google Analytics
    if (consent.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    // Funktionale Dienste (Google Fonts extern, Maps, YouTube, Instagram)
    if (consent.functional) {
      enableFunctionalScripts();
    }

    // Marketing (Facebook/Meta-Pixel etc.)
    if (consent.marketing) {
      enableMarketingScripts();
    }
  }

  // Platzhalter – hier musst du deine echten Einbindungen vornehmen:
  function enableGoogleAnalytics() {
    // Beispiel: dynamisch GA-Script einfügen, falls noch nicht vorhanden
    if (document.getElementById('ga-script')) return;

    const s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    // TODO: deine echte GA-ID eintragen:
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
  }

  function disableGoogleAnalytics() {
    // Hard-Disable im Frontend ist begrenzt möglich.
    // Optional: Cookies löschen, falls gesetzt.
    // document.cookie = '_ga=; Max-Age=0; path=/;';
    // Hier könntest du einen Hinweis protokollieren.
  }

  function enableFunctionalScripts() {
    // Hier könntest du z. B. Google Maps, YouTube-Embeds etc. nachladen,
    // falls du sie vorher blockierst oder als Platzhalter darstellst.
    // Beispiel: Iframes mit data-src -> src setzen.
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach((iframe) => {
      if (!iframe.src) {
        iframe.src = iframe.getAttribute('data-src');
      }
    });
  }

  function enableMarketingScripts() {
    // Beispiel: Facebook Pixel nur laden, wenn Marketing akzeptiert wurde.
    if (document.getElementById('fb-pixel')) return;

    // TODO: Deine echte Pixel-ID eintragen, wenn du es nutzt.
    // const s = document.createElement('script');
    // s.id = 'fb-pixel';
    // s.innerHTML = "/* Facebook Pixel Code hier */";
    // document.head.appendChild(s);
  }
});
