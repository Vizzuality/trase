import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import {
  pollyConfig,
  handleUnnecesaryRequests,
  expectToContain,
  expectChildrenToBe,
  click
} from './utils';

if (ENABLE_REDESIGN_PAGES) {
  Polly.register(PuppeteerAdapter);
  Polly.register(FSPersister);

  const BASE_URL = 'http://0.0.0.0:8081';
  const TIMEOUT = process.env.PUPETEER_TIMEOUT || 60000;

  jest.setTimeout(TIMEOUT);

  const { page } = global;
  const polly = new Polly('dashboard', pollyConfig(page));

  beforeAll(async () => {
    await page.setRequestInterception(true);
    const { server } = polly;
    handleUnnecesaryRequests(server, BASE_URL);
  });

  afterAll(async () => {
    await polly.flush();
    await polly.stop();
  });

  describe('Explore flow', () => {
    it('The happy path succeeds', async () => {
      await page.goto(`${BASE_URL}/explore`);
      await page.waitFor(1000);
      // Step 1
      expectChildrenToBe(page, 'featured-cards-row', 4);
      await page.waitForSelector('[data-test=featured-card-BRAZIL-SOY-EXPORTER-FOREST_500]', {
        timeout: 5000
      });

      await click(page, 'grid-list-item-button-BEEF');

      // Step 2
      await expectToContain(page, 'step-title', '2.');
      await expectToContain(page, 'featured-cards-title', 'Beef');
      await page.waitForSelector('[data-test=featured-card-BRAZIL-BEEF-EXPORTER-FOREST_500]', {
        timeout: 5000
      });

      await click(page, 'grid-list-item-button-COLOMBIA');

      // Step 3
      await expectToContain(page, 'step-title', '3.');
      await expectToContain(page, 'featured-cards-title', 'Colombia Beef');
      await page.waitForSelector('[data-test=featured-card-COLOMBIA-BEEF-EXPORTER-FOREST_500]', {
        timeout: 5000
      });

      await click(page, 'featured-cards-back-button');

      // Step 2
      await expectToContain(page, 'step-title', '2.');

      // Step 3
      await click(page, 'grid-list-item-button-BRAZIL');
      await expectToContain(page, 'step-title', '3.');

      // TODO: Lets use this when the link is complete
      // await Promise.all([
      //   click(page, 'top-card-BRAZIL-BEEF-EXPORTER-FOREST_500'),
      //   page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 })
      // ]);
      // await expect(page.url().startsWith(`${BASE_URL}/flows?selectedContextId=6`)).toBe(true);
    });
  });
}
