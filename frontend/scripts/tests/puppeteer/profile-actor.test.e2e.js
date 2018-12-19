/* eslint-disable no-console */

import { CONTEXTS, PROFILE_NODE_ACTOR } from './mocks';
import { getRequestMockFn } from './utils';
import { testProfileSpinners, testProfileSummary, testProfileMultiTable } from './shared';

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, PROFILE_NODE_ACTOR]);
  page.on('request', mockRequests);
  await page.goto(`${BASE_URL}/profile-actor?lang=en&nodeId=441&contextId=1&year=2015`);
});

describe('Profile actor - Full data', () => {
  it('All 5 widget sections attempt to load', async () => {
    expect.assertions(1);
    await testProfileSpinners(page, expect);
  });

  it('Summary widget loads successfully', async () => {
    expect.assertions(3);
    await testProfileSummary(page, expect, {
      titles: ['bunge', 'brazil'],
      profileType: 'actor',
      titlesLength: 4
    });
  });

  it('Top destination countries chart loads successfully', async () => {
    expect.assertions(2);

    await page.waitForSelector('[data-test=top-destination-countries]');
    const chartTitle = await page.$eval(
      '[data-test=top-destination-countries-chart-title]',
      el => el.textContent
    );
    const chartLines = await page.$$('[data-test=top-destination-countries-chart-d3-line-points]');

    expect(chartTitle.toLowerCase()).toMatch(
      'top destination countries of soy imported by bunge in 2015'
    );
    expect(chartLines.length).toBe(5);
  });

  it('Top destination countries map loads successfully', async () => {
    expect.assertions(2);

    await page.waitForSelector('[data-test=top-destination-countries-map]');
    const hasLegend = await page.$eval(
      '[data-test=top-destination-countries-map-legend]',
      el => el !== null
    );
    await page.waitForSelector('[data-test=top-destination-countries-map-d3-polygon-colored]');
    const coloredMapPolygons = await page.$$(
      '[data-test=top-destination-countries-map-d3-polygon-colored]'
    );

    expect(hasLegend).toBe(true);
    expect(coloredMapPolygons.length).toBe(25);
  });

  it('Top sourcing regions chart loads successfully', async () => {
    expect.assertions(2);

    await page.waitForSelector('[data-test=top-sourcing-regions]');
    const chartTitle = await page.$eval(
      '[data-test=top-sourcing-regions-chart-switch-title]',
      el => el.textContent
    );
    const chartLines = await page.$$('[data-test=top-sourcing-regions-chart-d3-line-points]');

    expect(chartTitle.toLowerCase()).toMatch(
      'top sourcing regions of soy imported by bunge in 2015:'
    );
    expect(chartLines.length).toBe(5);
  });

  it('Top sourcing regions map loads successfully', async () => {
    expect.assertions(2);

    await page.waitForSelector('[data-test=top-sourcing-regions-map]');
    const hasLegend = await page.$eval(
      '[data-test=top-sourcing-regions-map-legend]',
      el => el !== null
    );
    await page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    const coloredMapPolygons = await page.$$(
      '[data-test=top-sourcing-regions-map-d3-polygon-colored]'
    );

    expect(hasLegend).toBe(true);
    expect(coloredMapPolygons.length).toBe(387);
  });

  it('Top sourcing regions switch changes map', async () => {
    expect.assertions(2);

    await page.waitForSelector('[data-test=top-sourcing-regions-chart-switch]');
    await page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    const municipalityPolygons = await page.$$(
      '[data-test=top-sourcing-regions-map-d3-polygon-colored]'
    );
    expect(municipalityPolygons.length).toBe(387);

    await page.click('[data-test=top-sourcing-regions-chart-switch-item][data-key=biome]');
    await page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    const biomePolygons = await page.$$('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    expect(biomePolygons.length).toBe(5);
  });

  it('Deforestation risk widget loads successfully', async () => {
    expect.assertions(6);

    await testProfileMultiTable(page, expect, {
      tabsLength: 2,
      rowsLength: 10,
      columnsLength: 4,
      firstColumn: 'municipality',
      testId: 'deforestation-risk',
      firstRow: 'NOVA MUTUM218194N/A',
      title: "deforestation risk associated with bunge's top sourcing regions in 2015:"
    });
  });

  it('Company compare scatterplot loads successfully', async () => {
    expect.assertions(3);

    await page.waitForSelector('[data-test=company-compare]');
    const title = await page.$eval(
      '[data-test=company-compare-scatterplot-switch-title]',
      el => el.textContent
    );
    const circles = await page.$$('[data-test=company-compare-scatterplot-circle]');
    const selectedCircles = await page.$$('[data-test=company-compare-scatterplot-circle-current]');

    expect(title.toLowerCase()).toMatch('comparing companies importing soy from brazil in 2015');
    expect(circles.length).toBe(341);
    expect(selectedCircles.length).toBe(1);
  });
});
