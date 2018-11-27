/* eslint-disable no-console */
import { parse } from 'utils/stateURL';
import { CONTEXTS, GLOBAL_SEARCH } from './mocks';
import { getRequestMockFn } from './utils';

const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;
const BASE_URL = 'http://0.0.0.0:8081';

const { page } = global;
jest.setTimeout(TIMEOUT);

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, GLOBAL_SEARCH]);
  page.on('request', mockRequests);
  // we go to flows to trigger explore page redirect and cookie
  await Promise.all([
    page.goto(`${BASE_URL}/flows`),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  ]);
});

beforeEach(async () => {
  await Promise.all([
    page.goto(BASE_URL),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  ]);
});

describe('Profile Root search', () => {
  test.each([
    ['bunge', 'actor', 'importer', 1],
    ['bunge', 'actor', 'exporter', 1],
    ['sorriso', 'place', 'municipality', 1]
  ])('click search %s profiles button link', async (nodeName, profileType, nodeType, contextId) => {
    const globalSearchToggleSelector = '[data-test=global-search-toggle]';
    const globalSearchInputSelector = '[data-test=global-search-input]';
    const profileLinkSelector = `[data-test=global-search-result-${nodeName}-${contextId}-${nodeType}-link]`;

    await page.waitForSelector(globalSearchToggleSelector);
    await page.click(globalSearchToggleSelector);

    await page.waitForSelector(globalSearchInputSelector);
    await page.type(globalSearchInputSelector, nodeName);

    await page.waitForSelector(profileLinkSelector);
    await Promise.all([
      page.click(profileLinkSelector),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    const url = page.url();
    const query = parse(url.split('?')[1]);
    expect(url.startsWith(`${BASE_URL}/profile-${profileType}`)).toBe(true);
    expect(query.year).toBe('2017');
    expect(query.contextId).toBe(contextId.toString());
  });

  test.each([
    ['bunge', 'actor', 'importer', 1],
    ['bunge', 'actor', 'exporter', 1],
    ['sorriso', 'place', 'municipality', 1]
  ])('navigate to sankey', async (nodeName, profileType, nodeType, contextId) => {
    const globalSearchToggleSelector = '[data-test=global-search-toggle]';
    const globalSearchInputSelector = '[data-test=global-search-input]';
    const globalSearchResult = `[data-test=global-search-result-${nodeName}-${contextId}]`;

    await page.waitForSelector(globalSearchToggleSelector);
    await page.click(globalSearchToggleSelector);

    await page.waitForSelector(globalSearchInputSelector);
    await page.type(globalSearchInputSelector, nodeName);

    await page.waitForSelector(globalSearchResult);
    await Promise.all([
      page.click(globalSearchResult),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    const url = page.url();
    expect(url.startsWith(`${BASE_URL}/flows`)).toBe(true);
  });

  test.each([
    ['bunge', 'actor', 'importer', 1],
    ['bunge', 'actor', 'exporter', 1],
    ['sorriso', 'place', 'municipality', 1]
  ])('navigate to map', async (nodeName, profileType, nodeType, contextId) => {
    const globalSearchToggleSelector = '[data-test=global-search-toggle]';
    const globalSearchInputSelector = '[data-test=global-search-input]';
    const globalSearchResult = `[data-test=global-search-result-${nodeName}-${contextId}-map-link]`;

    await page.waitForSelector(globalSearchToggleSelector);
    await page.click(globalSearchToggleSelector);

    await page.waitForSelector(globalSearchInputSelector);
    await page.type(globalSearchInputSelector, nodeName);

    await page.waitForSelector(globalSearchResult);
    await Promise.all([
      page.click(globalSearchResult),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    const url = page.url();
    const query = parse(url.split('?')[1]);
    expect(url.startsWith(`${BASE_URL}/flows`)).toBe(true);
    expect(query.isMapVisible).toBe(true);
  });
});
