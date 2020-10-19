/* eslint-disable no-console,import/no-extraneous-dependencies */
import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { pollyConfig, handleUnnecesaryRequests } from './utils';
import { testProfileSummary, testProfileMultiTable, testProfileMiniSankey } from './shared';

expect.extend({ toMatchImageSnapshot });

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 60000;
const snapshotOptions = {
  failureThreshold: '0.05',
  failureThresholdType: 'percent'
};

jest.setTimeout(TIMEOUT);
const { page } = global;
const polly = new Polly('profile-place', pollyConfig(page));

beforeAll(async () => {
  await page.setRequestInterception(true);
  const { server } = polly;
  handleUnnecesaryRequests(server, BASE_URL);
  await page.goto(`${BASE_URL}/profile-place?lang=en&nodeId=10902&contextId=1&year=2015`);
});

afterAll(async () => {
  await polly.flush();
  await polly.stop();
});

describe('Profile place - Full data', () => {
  test('Summary widget loads successfully', async () => {
    await testProfileSummary(page, {
      params: ['soy', '2015', 'brazil', 'cerrado', 'mato grosso'],
      profileType: 'place',
      titlesLength: 5
    });
  });

  test('Sustainability indicators widget loads successfully', async () => {
    await testProfileMultiTable(page, {
      tabsLength: 4,
      rowsLength: 4,
      columnsLength: 2,
      firstColumn: 'score',
      testId: 'sustainability-indicators',
      firstRow: 'Territorial deforestation1,22975',
      title: 'sustainability indicators'
    });
  });

  test(
    'Deforestation trajectory widget loads successfully',
    async () => {
      await page.waitForSelector('[data-test=deforestation-trajectory]');
      const title = await page.$eval(
        '[data-test=deforestation-trajectory-title]',
        el => el.textContent
      );
      const chartLines = await page.$$('[data-test=deforestation-trajectory-line]');
      const chartAreaLines = await page.$$('[data-test=deforestation-trajectory-area-line]');
      const chartAreas = await page.$$('[data-test=deforestation-trajectory-area]');
      expect(title.toLowerCase()).toMatch('deforestation trajectory of sorriso');
      expect(chartLines.length).toBe(1);
      expect(chartAreaLines.length).toBe(2);
      expect(chartAreas.length).toBe(2);
    },
    TIMEOUT
  );

  test('Top traders widget loads successfully', async () => {
    await testProfileMiniSankey(page, {
      testId: 'top-traders',
      title: 'top traders of soy in sorriso in 2015',
      flowsLength: 8
    });
  });

  test('Top importing companies widget loads successfully', async () => {
    await testProfileMiniSankey(page, {
      testId: 'top-importers',
      title: 'top importing countries of soy from sorriso in 2015',
      flowsLength: 10
    });
  });

  xtest('Place profile screenshot - Mobile', async () => {
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true
    });

    await page.addStyleTag({
      content: `
      [data-test=cookie-banner] { display: none !important; }
    `
    });

    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-place-MOBILE',
      ...snapshotOptions
    });
  });
});
