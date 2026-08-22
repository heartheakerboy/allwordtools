/**
 * Automatic IndexNow URL Submitter for Bing, Yandex, Seznam & Naver.
 * Submits all localized tool URLs, categories, and core pages to IndexNow API.
 */
const { allTools, categories } = require('g:/all word tool/src/data/tools.ts');

const HOST = 'www.allwordtools.com';
const BASE_URL = 'https://' + HOST;
const API_KEY = 'e3d7a8f9c1b24e6a8d0f2a4b6c8e0d2f';
const KEY_LOCATION = `${BASE_URL}/${API_KEY}.txt`;

// Enabled locales
const LOCALES = ['en', 'es', 'hi', 'pt', 'ar', 'ru', 'de', 'id'];

function generateAllUrls() {
  const urls = new Set();

  for (const locale of LOCALES) {
    const prefix = locale === 'en' ? '' : '/' + locale;

    // Core pages
    urls.add(BASE_URL + prefix + '/');
    urls.add(BASE_URL + prefix + '/tools');
    urls.add(BASE_URL + prefix + '/about');
    urls.add(BASE_URL + prefix + '/learn');
    urls.add(BASE_URL + prefix + '/contact');

    // Categories
    for (const cat of categories) {
      urls.add(`${BASE_URL}${prefix}/category/${cat.slug}`);
    }

    // Tools (all 92 tools)
    for (const tool of allTools) {
      urls.add(`${BASE_URL}${prefix}/tool/${tool.slug}`);
    }
  }

  return Array.from(urls);
}

async function submitToIndexNow() {
  const urlList = generateAllUrls();
  console.log(`Generated ${urlList.length} unique URLs for IndexNow submission.`);

  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  try {
    console.log('Submitting to https://api.indexnow.org/indexnow ...');
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ Success! IndexNow returned HTTP ${res.status}. All ${urlList.length} URLs submitted to Bing & Yandex for instant indexing!`);
    } else {
      const text = await res.text();
      console.log(`⚠️ IndexNow returned HTTP ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error('❌ Error submitting to IndexNow:', err.message);
  }
}

submitToIndexNow();
