/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import { mockRequests, openBrowser } from '../utils';
import { testRootSearch } from './shared';

let page;
let browser;
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

beforeAll(async () => {
  browser = await puppeteer.launch(openBrowser(false));
  page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on(
    'request',
    mockRequests([
      'brazil-soy',
      'brazil-soy-node-search',
      'brazil-soy-place-profile',
      'brazil-soy-actor-profile'
    ])
  );
});

afterAll(() => {
  browser.close();
});

describe('Profile Root search', () => {
  test(
    'search for actor',
    async () => {
      const nodeName = 'bunge';
      const nodeType = 'importer';
      const profileType = 'actor';

      await testRootSearch(page, expect, { nodeName, nodeType, profileType });
    },
    TIMEOUT
  );

  test(
    'search for municipality',
    async () => {
      const nodeName = 'sorriso';
      const nodeType = 'municipality';
      const profileType = 'place';

      expect.assertions(1);
      await testRootSearch(page, expect, { nodeName, nodeType, profileType });
    },
    TIMEOUT
  );
});
