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

  const endpoints = [
    'https://www.bing.com/indexnow',
    'https://api.indexnow.org/indexnow',
    'https://yandex.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Submitting ${urlList.length} URLs to ${endpoint} ...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 200 || res.status === 202) {
        console.log(`✅ Success! [${endpoint}] returned HTTP ${res.status}. URLs accepted for instant indexing!`);
      } else {
        const text = await res.text();
        console.log(`⚠️ [${endpoint}] returned HTTP ${res.status}: ${text || 'Pending verification'}`);
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err.message);
    }
  }
}

submitToIndexNow();
