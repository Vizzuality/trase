/* eslint-disable no-console */

// import { CONTEXTS, PROFILE_NODE_ACTOR } from './mocks';
// import { getRequestMockFn } from './utils';
const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;

beforeAll(async () => {
  await page.setRequestInterception(true);
  await page.goto(`${BASE_URL}/dashboards?`);
});

describe('Dashboards flow', () => {
  it('At least 1 create card is shown', async () => {
    // expect.assertions(1);
    const cardsContainerSelector = '[dashboard-root-grid-row]';
    const cardsSelector = '[dashboard-root-card]';
    await page.waitForSelector(cardsContainerSelector);
    const cards = await page.$$(cardsSelector);
    expect(cards.length).toBeGreaterThan(0);
  });
});
