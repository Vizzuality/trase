import {
  DASHBOARD_TEMPLATES,
  CONTEXTS,
  COUNTRIES,
  COMMODITIES,
  DESTINATIONS,
  PARAMETRISED_CHARTS,
  COMPANIES,
  COMPANY_TYPES
} from './mocks';
import { getRequestMockFn } from './utils';

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([
    DASHBOARD_TEMPLATES,
    CONTEXTS,
    COUNTRIES,
    COMMODITIES,
    DESTINATIONS,
    PARAMETRISED_CHARTS,
    COMPANIES,
    COMPANY_TYPES
  ]);
  page.on('request', mockRequests);
});

describe('Dashboards flow', () => {
  it('The create card is shown', async () => {
    await page.goto(`${BASE_URL}/dashboards`);
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const cardsContainerSelector = '[data-test=dashboard-root-grid-row]';
    const cardsSelector = '[data-test=dashboard-root-card]';
    await page.waitForSelector(cardsContainerSelector);
    await page.waitForSelector(cardsSelector);
    const cards = await page.$$(cardsSelector);
    expect(cards.length).toBe(1);

    const createButton = '[data-test=dashboard-root-create-button]';
    await page.waitForSelector(createButton);
    await page.click('[data-test=dashboard-root-create-button]');

    // Welcome step
    const welcomeButtonSelector = '[data-test=dashboard-welcome-button]';
    await page.waitForSelector(welcomeButtonSelector);
    await page.click(welcomeButtonSelector);

    // Sources step
    const dashboardPanelSentenceSelector = '[data-test=dashboard-panel-sentence]';
    await page.waitForSelector(dashboardPanelSentenceSelector);
    const sourceSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(sourceSectionTitle).toMatch('source');
    const regionButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(regionButtonsSelector);
    const regionButtons = await page.$$(regionButtonsSelector);
    expect(regionButtons.length).toBe(7);

    const brazilButtonSelector = '[data-test=grid-list-item-button-BRAZIL]';
    await page.waitForSelector(brazilButtonSelector);
    await page.click(brazilButtonSelector);

    const continueButton = '[data-test=dashboard-modal-actions-continue]';
    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Commodities step
    const commoditySectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(commoditySectionTitle).toMatch('commodity');

    const commodityButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(commodityButtonsSelector);
    const commodityButtons = await page.$$(commodityButtonsSelector);
    expect(commodityButtons.length).toBe(11);
    const soyButtonSelector = '[data-test=grid-list-item-button-SOY]';
    await page.click(soyButtonSelector);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Destinations step
    const destinationsSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(destinationsSectionTitle).toMatch('destinations');
    const destinationsButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(destinationsButtonsSelector);
    const destinationsButtons = await page.$$(destinationsButtonsSelector);
    expect(destinationsButtons.length).toBe(25);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Companies step
    const companiesSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(companiesSectionTitle).toMatch('companies');
    const companiesButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(companiesButtonsSelector);
    const companiesButtons = await page.$$(companiesButtonsSelector);
    expect(companiesButtons.length).toBe(25);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Dashboard view
    await page.waitForSelector('[data-test=dashboard-element-title]');
  });
});
