/* eslint-disable no-console */
import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { testRootSearch } from './shared';
import { pollyConfig, handleUnnecesaryRequests } from './utils';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

const TIMEOUT = process.env.PUPETEER_TIMEOUT || 60000;
const BASE_URL = 'http://0.0.0.0:8081';

jest.setTimeout(TIMEOUT);
const { page } = global;
const polly = new Polly('profile-root', pollyConfig(page));

beforeAll(async () => {
  await page.setRequestInterception(true);
  const { server } = polly;
  handleUnnecesaryRequests(server, BASE_URL);
});

afterAll(async () => {
  await polly.flush();
  await polly.stop();
});

describe('Profile Root search', () => {
  it('search for actor', async () => {
    await page.goto(`${BASE_URL}/profiles`);

    const nodeName = 'bunge';
    const nodeType = 'importer';
    const profileType = 'actor';

    await testRootSearch(page, { nodeName, nodeType, profileType });
  });

  it('search for municipality', async () => {
    await page.goto(`${BASE_URL}/profiles`, { waitUntil: 'networkidle2', timeout: 0 });
    const nodeName = 'sorriso';
    const nodeType = 'municipality';
    const profileType = 'place';

    await testRootSearch(page, { nodeName, nodeType, profileType });
    return Promise.resolve();
  });
});
