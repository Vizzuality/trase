import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { pollyConfig, handleUnnecesaryRequests } from './utils';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = 60000;

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
    expect(destinationsButtons.length).toBe(24);

    const argentinaButtonSelector = '[data-test=grid-list-item-button-ITALY]';
    await page.waitForSelector(argentinaButtonSelector);
    await page.click(argentinaButtonSelector);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Companies step
    const exportersSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(exportersSectionTitle).toMatch('exporters');

    await page.waitFor(1000);
    const exporterTab = '[data-test=tab-item][data-key=EXPORTER]';
    await page.waitForSelector(exporterTab);
    await page.click(exporterTab);

    const exportersButtonsSelector = '[data-test=grid-list-item-button]';
    await page.waitForSelector(exportersButtonsSelector);
    const exportersButtons = await page.$$(exportersButtonsSelector);

    expect(exportersButtons.length).toBe(24);

    const cargillButtonSelector = '[data-test=grid-list-item-button-CARGILL]';
    await page.waitForSelector(cargillButtonSelector, { visible: true });
    await page.waitFor(300);
    await page.click(cargillButtonSelector);
    await page.waitFor(300);
    const coamoButtonSelector = '[data-test=grid-list-item-button-COAMO]';
    await page.waitForSelector(coamoButtonSelector, { visible: true });
    await page.click(coamoButtonSelector);

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Skip importers step
    const importersSectionTitle = await page.$eval(
      dashboardPanelSentenceSelector,
      el => el.textContent
    );
    expect(importersSectionTitle).toMatch('importers');

    await page.waitForSelector(continueButton);
    await page.click(continueButton);

    // Dashboard view
    await page.waitForSelector('[data-test=dashboard-element-title]');

    // Has initial charts
    await page.waitFor(() => document.querySelector('[data-test=widget-spinner]') !== null);
    await page.waitFor(() => document.querySelectorAll('[data-test=widget-spinner]').length === 0);
    const dashboardWidgetChartSelector = '[data-test=widget-chart]';
    const dashboardWidgetRankingSelector = '[data-test=widget-ranking]';
    const dashboardWidgetDynamicSentenceSelector = '[data-test=widget-dynamic-sentence]';
    const widgetsCharts = page.$$(dashboardWidgetChartSelector);
    const widgetRanking = page.$$(dashboardWidgetRankingSelector);
    const widgetSentence = page.$$(dashboardWidgetDynamicSentenceSelector);
    const result = await Promise.all([widgetsCharts, widgetRanking, widgetSentence]);

    expect(result[0].length).toBe(5);
    expect(result[1].length).toBe(2);
    expect(result[2].length).toBe(1);

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
    await page.waitForSelector('[data-test=widget-spinner]');
    await page.waitFor(() => document.querySelectorAll('[data-test=widget-spinner]').length === 0);
    await page.waitForSelector(widgetChart);
    const multiYearWidgets = await page.$$(widgetChart);

    expect(multiYearWidgets.length).toBe(8);

    // Change unit selector
    const unitDropdownSelector = '[data-test=dropdown-selected-item-units]';
    await page.waitForSelector(unitDropdownSelector);
    await page.click(unitDropdownSelector);

    const territorialOptionSelector = '[data-test=dropdown-menu-item-territorial-deforestation]';
    await page.waitForSelector(territorialOptionSelector);
    await page.click(territorialOptionSelector);

    const territorialWidgetChart = '[data-test=widget-chart]';
    await page.waitForSelector('[data-test=widget-spinner]');
    await page.waitFor(() => document.querySelectorAll('[data-test=widget-spinner]').length === 0);
    await page.waitForSelector(territorialWidgetChart);
    const territorialMultiYearWidgets = await page.$$(territorialWidgetChart);

    expect(territorialMultiYearWidgets.length).toBe(8);

    // Change indicator selector
    const indicatorDropdownSelector = '[data-test=dropdown-selected-item-indicator]';
    await page.waitForSelector(indicatorDropdownSelector);
    await page.click(indicatorDropdownSelector);

    const biomeOptionSelector = '[data-test=recolor-by-item-biome]';
    await page.waitForSelector(biomeOptionSelector);
    await page.click(biomeOptionSelector);

    const biomeWidgetChart = '[data-test=widget-chart]';
    await page.waitForSelector('[data-test=widget-spinner]');
    await page.waitFor(() => document.querySelectorAll('[data-test=widget-spinner]').length === 0);

    await page.waitForSelector(biomeWidgetChart);
    const biomeMultiYearWidgets = await page.$$(biomeWidgetChart);

    expect(biomeMultiYearWidgets.length).toBe(10);

    const widgetDropdowSelector =
      '[data-test=dropdown-selected-item-selection-overview-of-cargill]';
    await page.waitForSelector(widgetDropdowSelector);
    const text = await page.$eval(widgetDropdowSelector, el => el.innerText);

    expect(text).toMatch('Cargill');
  });
});
