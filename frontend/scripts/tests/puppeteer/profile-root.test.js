/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import { CONTEXTS, PROFILE_ROOT_SEARCH } from '../mocks';
import { getRequestMockFn, openBrowser } from '../utils';
import { testRootSearch } from './shared';

let page;
let browser;
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;
const BASE_URL = 'http://0.0.0.0:8081';

beforeAll(async () => {
  browser = await puppeteer.launch(openBrowser(false));
  page = await browser.newPage();
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, PROFILE_ROOT_SEARCH]);
  page.on('request', mockRequests);
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

      expect.assertions(1);

      await page.goto(`${BASE_URL}/profiles`);
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

      await page.goto(`${BASE_URL}/profiles`);
      await testRootSearch(page, expect, { nodeName, nodeType, profileType });
    },
    TIMEOUT
  );
});
