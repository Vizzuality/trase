/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import { mockRequests, openBrowser } from '../utils';
import {
  testProfileSpinners,
  testProfileSummary,
  testProfileMultiTable,
  testProfileMiniSankey
} from './shared';

let page;
let browser;
const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

beforeAll(async () => {
  browser = await puppeteer.launch(openBrowser(false));
  page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', mockRequests(['brazil-soy', 'brazil-soy-place-profile']));
});

afterAll(() => {
  browser.close();
});

describe('Profile place - Full data', () => {
  test(
    'All 5 widget sections attempt to load',
    async () => {
      expect.assertions(1);
      await page.goto(`${BASE_URL}/profile-place?lang=en&nodeId=2759&contextId=1&year=2015`);
      await testProfileSpinners(page, expect);
    },
    TIMEOUT
  );

  test(
    'Summary widget loads successfully',
    async () => {
      expect.assertions(3);
      await testProfileSummary(page, expect, {
        titles: ['sorriso', 'soy'],
        profileType: 'place',
        titlesLength: 3
      });
    },
    TIMEOUT
  );

  test(
    'Sustainability indicators widget loads successfully',
    async () => {
      expect.assertions(6);

      await testProfileMultiTable(page, expect, {
        tabsLength: 4,
        rowsLength: 6,
        columnsLength: 2,
        firstColumn: 'score',
        testId: 'sustainability-indicators',
        firstRow: 'Territorial deforestation7090',
        title: 'sustainability indicators:'
      });
    },
    TIMEOUT
  );

  test(
    'Deforestation trajectory widget loads successfully',
    async () => {
      expect.assertions(1);
      await page.waitForSelector('[data-test=deforestation-trajectory]');
      const title = await page.$eval(
        '[data-test=deforestation-trajectory-title]',
        el => el.textContent
      );
      expect(title.toLowerCase()).toMatch('deforestation trajectory of sorriso');
    },
    TIMEOUT
  );

  test(
    'Top traders widget loads successfully',
    async () => {
      expect.assertions(2);
      await testProfileMiniSankey(page, expect, {
        testId: 'top-traders',
        title: 'top traders of soy in sorriso in 2015',
        flowsLength: 10
      });
    },
    TIMEOUT
  );

  test(
    'Top importer companies widget loads successfully',
    async () => {
      expect.assertions(2);
      await testProfileMiniSankey(page, expect, {
        testId: 'top-importers',
        title: 'top importer countries of sorriso soy in 2015',
        flowsLength: 10
      });
    },
    TIMEOUT
  );
});
