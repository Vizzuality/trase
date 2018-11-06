/* eslint-disable no-console */
import { CONTEXTS, PROFILE_ROOT_SEARCH } from './mocks';
import { getRequestMockFn } from './utils';
import { testRootSearch } from './shared';

const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;
const BASE_URL = 'http://0.0.0.0:8081';

const { page } = global;

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, PROFILE_ROOT_SEARCH]);
  page.on('request', mockRequests);
});

describe('Profile Root search', () => {
  it(
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

  it(
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
