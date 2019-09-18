import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { pollyConfig, handleUnnecesaryRequests } from './utils';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

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

describe('Dashboards flow', () => {
  it('The happy path succeeds', async () => {
    await page.goto(`${BASE_URL}/dashboards`);

    const cardsSelector = '[data-test=dashboard-root-card]';
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
    expect(regionButtons.length).toBe(8);

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
    expect(commodityButtons.length).toBe(12);
    const soyButtonSelector = '[data-test=grid-list-item-button-SOY]';
    await page.click(soyButtonSelector);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Destinations step
    const destinationsSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(destinationsSectionTitle).toMatch('import countries');
    const destinationsButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(destinationsButtonsSelector);
    const destinationsButtons = await page.$$(destinationsButtonsSelector);
    expect(destinationsButtons.length).toBe(25);

    const argentinaButtonSelector = '[data-test=grid-list-item-button-ARGENTINA]';
    await page.waitForSelector(argentinaButtonSelector);
    await page.click(argentinaButtonSelector);

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

    expect(companiesButtons.length).toBe(22);

    const coamoButtonSelector = '[data-test=grid-list-item-button-COAMO]';
    await page.waitForSelector(coamoButtonSelector);
    await page.click(coamoButtonSelector);

    await page.waitFor(16);
    const royalAgroCereaisButtonSelector = '[data-test=grid-list-item-button-ROYAL-AGRO-CEREAIS]';
    await page.waitForSelector(royalAgroCereaisButtonSelector);
    await page.click(royalAgroCereaisButtonSelector);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Dashboard view
    await page.waitForSelector('[data-test=dashboard-element-title]');

    // Has initial charts
    const dashboardWidgetSelector = '[data-test="dashboard-widget-container"]';
    await page.waitForSelector('[data-test=widget-spinner]', { hidden: true });
    await page.waitForSelector(dashboardWidgetSelector);
    const widgets = await page.$$(dashboardWidgetSelector);

    expect(widgets.length).toBe(6);

    // Change year dropdown
    const yearDropdownSelector = '[data-test=dropdown-selected-item-year]';
    await page.waitForSelector(yearDropdownSelector);
    await page.click(yearDropdownSelector);
    const yearSelector2003 = '[data-test=years-range-button-2003]';
    const yearSelector2017 = '[data-test=years-range-button-2017]';
    await page.waitForSelector(yearSelector2003);
    await page.click(yearSelector2003);
    await page.click(yearDropdownSelector);
    await page.waitForSelector(yearSelector2017);
    await page.click(yearSelector2017);

    const widgetChart = '[data-test=widget-chart]';
    await page.waitForSelector('[data-test=widget-spinner]', { hidden: true });
    await page.waitForSelector(widgetChart);
    const multiYearWidgets = await page.$$(widgetChart);

    expect(multiYearWidgets.length).toBe(6);

    // Change unit selector
    const unitDropdownSelector = '[data-test=dropdown-selected-item-units]';
    await page.waitForSelector(unitDropdownSelector);
    await page.click(unitDropdownSelector);

    const territorialOptionSelector = '[data-test=dropdown-menu-item-territorial-deforestation]';
    await page.waitForSelector(territorialOptionSelector);
    await page.click(territorialOptionSelector);

    const territorialWidgetChart = '[data-test=widget-chart]';
    await page.waitForSelector('[data-test=widget-spinner]', { hidden: true });
    await page.waitForSelector(territorialWidgetChart);
    const territorialMultiYearWidgets = await page.$$(territorialWidgetChart);

    expect(territorialMultiYearWidgets.length).toBe(6);

    // Change indicator selector
    const indicatorDropdownSelector = '[data-test=dropdown-selected-item-indicator]';
    await page.waitForSelector(indicatorDropdownSelector);
    await page.click(indicatorDropdownSelector);

    const biomeOptionSelector = '[data-test=recolor-by-item-biome]';
    await page.waitForSelector(biomeOptionSelector);
    await page.click(biomeOptionSelector);

    const biomeWidgetChart = '[data-test=widget-chart]';
    await page.waitFor(16);
    await page.waitForSelector(biomeWidgetChart);
    const biomeMultiYearWidgets = await page.$$(biomeWidgetChart);

    expect(biomeMultiYearWidgets.length).toBe(8);

    const widgetDropdowSelector = '[data-test=dropdown-selected-item-selection-overview-of-coamo]';
    await page.waitForSelector(widgetDropdowSelector);
    const text = await page.$eval(widgetDropdowSelector, el => el.textContent);

    expect(text).toMatch('Selection overview of -coamoCoamo');
  });
});
