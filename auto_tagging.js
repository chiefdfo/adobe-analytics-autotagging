// Helper functions
const hasReferrer = () => referrer !== undefined && referrer.length >= 1;
const hasNoEcidParam = () => queryParam.indexOf('ecid') === -1;
const referrerContains = (term) => referrer.indexOf(term) > -1;
const isFirstPageView = () => eventCount === 0;
const matchesRegex = (pattern) => pattern.test(referrer);
const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(document.location.search);
  return urlParams.get(param);
};

/* 
  Track traffic source in a fixed 9-level structure with variable parameters
  nn = not needed, empty placeholder values - can be replaced or deleted if not needed
  auto_tag = definition for automaticly detected traffic source - can be changed if other notation is needed 
*/

const trackTrafficSource = (category, source) => {
  adobeDataLayer.push({
    "ecid": `${category}.auto_tag.auto_tag.${source}.nn.nn.nn.nn.nn.`
  });
};

const trackCampaign = () => {
  const queryParam = document.location.search;
  const referrer = document.referrer;
  const eventCountStr = sessionStorage.getItem('adobeAnalyticsSessionEventCount');
  const eventCount = eventCountStr ? parseInt(eventCountStr) : 0;


  // If the User is not in his first page view, do not set any ECID information
  if (!isFirstPageView()) {
    return;
  }

  // Check for ECID in URL parameter
  if (queryParam.length !== 0 && queryParam.indexOf('ecid') >= 0) {
    const ecid = getUrlParam('ecid');
    if (ecid) {
      const dataLayerState = adobeDataLayer.getState() || {};
      if (typeof dataLayerState.ecid === 'undefined') {
        adobeDataLayer.push({ "ecid": ecid });
      }
    }
    return;
  }

  if (!hasReferrer() || !hasNoEcidParam()) {
    // If there is no ECID Parameter or any identifying information set the source to "direct traffic" without referrer
    if (referrer.length === 0 && hasNoEcidParam()) {
      trackTrafficSource('dir', 'no-referrer');
    }
    return;
  }
  
  /* 
    Pattern Matrix for most of the possible referring platforms on the Internet
    
    SEA:
      gclid - Google Click ID
      msclkid - Microsoft Click ID
    SEO:
      Mostly identified through direct referrings withour msclkid and gclid Parameters being present.
    Socialmedia:
      Most popular Social Media Platforms are implemented, feel free to add more here too.
    Internal:
      Redirect through Microsoft Teams Chat, here you have to implement your internal platforms linking to your portal (e.g Salesforce).
    Email:
      Alot of german Email Providers implemented, feel free to add more here too.
  */
  const patterns = {
    sea: {
      google: (referrerContains('gclid') && !referrerContains('msclkid')) || 
              (referrerContains('gclid') && referrerContains('google')),
      bing: referrerContains('msclkid') || 
            (referrerContains('gclid') && !referrerContains('google'))
    },
    seo: {
      google: (!referrerContains('msclkid') && !referrerContains('gclid') && 
              (/(\/|www|com)\.?google\w*(\.\w{2,3})(\.\w{2,3})?/.test(referrer) || 
               referrerContains('google.com'))),
      bing: (!referrerContains('msclkid') && !referrerContains('gclid') && 
              referrerContains('bing.com')),
      ecosia: (!referrerContains('msclkid') && !referrerContains('gclid') && 
              referrerContains('ecosia')),
      duckduckgo: (!referrerContains('msclkid') && !referrerContains('gclid') && 
                  referrerContains('duckduckgo')),
      webde: (!referrerContains('msclkid') && !referrerContains('gclid') && 
              referrerContains('suche.web.de')),
      yahoo: (!referrerContains('msclkid') && !referrerContains('gclid') && 
              referrerContains('search.yahoo.com'))
    },
    socialmedia: {
      facebook: referrerContains('facebook.com'),
      instagram: referrerContains('instagram.com'),
      youtube: referrerContains('youtube.com'),
      linkedin: referrerContains('linkedin.com'),
      xing: referrerContains('xing.com'),
      twitter: referrerContains('twitter.com') || 
                referrerContains('https://x.com')  || 
                referrerContains('https://t.co')
    },
    internal: {
      sources: referrerContains('statics.teams.cdn.office.net')
    },
    email: {
      providers: referrerContains('outlook.live') || 
                  referrerContains('mail.yahoo') || 
                  referrerContains('mail.google') || 
                  referrerContains('deref-web-02.de/mail') || 
                  referrerContains('email.seznam') || 
                  referrerContains('my.mail.de') || 
                  referrerContains('webmail.unity-mail.de') || 
                  referrerContains('webmail.freenet') || 
                  referrerContains('email.t-online') || 
                  referrerContains('kabelmail.de') || 
                  referrerContains('mail.centrum') || 
                  referrerContains('webmail.osnanet') || 
                  referrerContains('deref-gmx.net') || 
                  referrerContains('mail.vodafone') || 
                  referrerContains('mandrillapp.com') || 
                  referrerContains('deref-web')
    }
  };
  
  if (patterns.sea.bing) {
    trackTrafficSource('sea', 'bing');
  } else if (patterns.sea.google) {
    trackTrafficSource('sea', 'google');
  } else if (patterns.seo.google) {
    trackTrafficSource('seo', 'google');
  } else if (patterns.seo.bing) {
    trackTrafficSource('seo', 'bing');
  } else if (patterns.seo.ecosia) {
    trackTrafficSource('seo', 'ecosia');
  } else if (patterns.seo.duckduckgo) {
    trackTrafficSource('seo', 'duckduckgo');
  } else if (patterns.seo.webde) {
    trackTrafficSource('seo', 'webde');
  } else if (patterns.seo.yahoo) {
    trackTrafficSource('seo', 'yahoo');
  } else if (
    referrerContains('suche.t-online.de') || 
    referrerContains('myway.com') || 
    referrerContains('askjeeves.net') || 
    referrerContains('seznam.cz') || 
    referrerContains('search.mywebsearch.com') || 
    referrerContains('centrum.cz') || 
    referrerContains('ask.com') || 
    referrerContains('avg.com') || 
    referrerContains('suche.gmx.net') || 
    referrerContains('search.avira.com') || 
    referrerContains('metager.de') || 
    referrerContains('suche.1und1.de') || 
    referrerContains('results.searchlock.com') || 
    referrerContains('cse.yukoono.mobi') || 
    referrerContains('cse.intercontent.de/vf.php') || 
    referrerContains('yandex.ru') || 
    referrerContains('qwant.com') || 
    referrerContains('searchencrypt.com') || 
    referrerContains('search.becovi.com') || 
    referrerContains('startpage.com') || 
    referrerContains('isearch.start.fyi') || 
    referrerContains('cse.start.fyi') || 
    referrerContains('search.brave.com') || 
    referrerContains('kadaza.de') || 
    referrerContains('search.gmx.com') || 
    /^https:\/\/s\.gmx\.com/.test(referrer)
  ) {
    trackTrafficSource('seo', 'other');
  } else if (patterns.socialmedia.facebook) {
    trackTrafficSource('socialmedia', 'facebook');
  } else if (patterns.socialmedia.instagram) {
    trackTrafficSource('socialmedia', 'instagram');
  } else if (patterns.socialmedia.youtube) {
    trackTrafficSource('socialmedia', 'youtube');
  } else if (patterns.socialmedia.linkedin) {
    trackTrafficSource('socialmedia', 'linkedin');
  } else if (patterns.socialmedia.xing) {
    trackTrafficSource('socialmedia', 'xing');
  } else if (patterns.socialmedia.twitter) {
    trackTrafficSource('socialmedia', 'twitter');
  } else if (
    referrerContains('wordpress') || 
    referrerContains('reddit.com') || 
    referrerContains('vk.com') || 
    referrerContains('pinterest.com') || 
    referrerContains('mobile.ok.ru') || 
    referrerContains('ok.ru') || 
    referrerContains('blogspot.com') || 
    referrerContains('yelp.com') || 
    referrerContains('glassdoor.com')
  ) {
    trackTrafficSource('socialmedia', 'other');
  } else if (patterns.internal.sources) {
    trackTrafficSource('int', 'auto_tag');
  } else if (patterns.email.providers) {
    trackTrafficSource('email', 'other');
  } else if (referrer.length === 0) {
    trackTrafficSource('dir', 'no-referrer');
  }
};


try {
  trackCampaign();
} catch (error) {
  console.log('Error in campaign tracking: ' + error.message);
}
