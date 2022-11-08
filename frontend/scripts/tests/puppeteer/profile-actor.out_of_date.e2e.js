/* eslint-disable no-console,import/no-extraneous-dependencies */

import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { pollyConfig, handleUnnecesaryRequests } from './utils';
import { testProfileSummary, testProfileMultiTable } from './shared';

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
const polly = new Polly('profile-actor', pollyConfig(page));

beforeAll(async () => {
  await page.setRequestInterception(true);
  const { server } = polly;
  handleUnnecesaryRequests(server, BASE_URL);
  await page.goto(`${BASE_URL}/profile-actor?lang=en&nodeId=33624&contextId=1&year=2015`);
});

afterAll(async () => {
  await polly.flush();
  await polly.stop();
});

describe('Profile actor - Full data', () => {
  it('Summary widget loads successfully', async () => {
    await testProfileSummary(page, {
      title: 'Bunge',
      params: ['exporter', 'soy', 'brazil'],
      profileType: 'actor',
      titlesLength: 4
    });
  });

  it('Top destination countries chart loads successfully', async () => {
    await page.waitForSelector('[data-test=top-destination-countries]');
    const chartTitle = await page.$eval(
      '[data-test=top-destination-countries-chart-title]',
      el => el.textContent
    );
    const chartLines = await page.$$('[data-test=top-destination-countries-chart-d3-line-points]');

    expect(chartTitle.toLowerCase()).toMatch(
      'top destination countries of soy exported by bunge in 2015'
    );
    expect(chartLines.length).toBe(5);
  });

  it('Top destination countries map loads successfully', async () => {
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
    expect(coloredMapPolygons.length).toBe(32);
  });

  it('Top sourcing regions chart loads successfully', async () => {
    await page.waitForSelector('[data-test=top-sourcing-regions]');
    const chartTitle = await page.$eval(
      '[data-test=top-sourcing-regions-chart-switch-title]',
      el => el.textContent
    );
    const chartLines = await page.$$('[data-test=top-sourcing-regions-chart-d3-line-points]');

    expect(chartTitle.toLowerCase()).toMatch(
      'top sourcing regions of soy exported by bunge in 2015'
    );
    expect(chartLines.length).toBe(5);
  });

  it('Top sourcing regions map loads successfully', async () => {
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
    expect(coloredMapPolygons.length).toBe(218);
  });

  it('Top sourcing regions switch changes map', async () => {
    await page.waitForSelector('[data-test=top-sourcing-regions-chart-switch]');
    await page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    const municipalityPolygons = await page.$$(
      '[data-test=top-sourcing-regions-map-d3-polygon-colored]'
    );
    expect(municipalityPolygons.length).toBe(218);

    await page.click('[data-test=top-sourcing-regions-chart-switch-item][data-key=biome]');
    await page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    const biomePolygons = await page.$$('[data-test=top-sourcing-regions-map-d3-polygon-colored]');
    expect(biomePolygons.length).toBe(5);
  });

  it('Deforestation exposure widget loads successfully', async () => {
    await testProfileMultiTable(page, {
      tabsLength: 2,
      rowsLength: 10,
      columnsLength: 3,
      linkName: '/profile-place',
      linkQuery: { nodeId: '10794', year: '2015', contextId: '1' },
      firstColumn: 'municipality',
      testId: 'deforestation-risk',
      firstRow: 'CAMPO NOVO DO PARECIS89ha99ha',
      title: "deforestation exposure associated with bunge's top sourcing regions in 2015"
    });
  });

  it('Company compare scatterplot loads successfully', async () => {
    await page.waitForSelector('[data-test=company-compare]');
    const title = await page.$eval(
      '[data-test=company-compare-scatterplot-switch-title]',
      el => el.textContent
    );
    const circles = await page.$$('[data-test=company-compare-scatterplot-circle]');
    const selectedCircles = await page.$$('[data-test=company-compare-scatterplot-circle-current]');

    expect(title.toLowerCase()).toMatch('comparing companies exporting soy from brazil in 2015');
    expect(circles.length).toBe(347);
    expect(selectedCircles.length).toBe(1);
  });

  xit('Actor profile screenshot - Mobile', async () => {
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
      customSnapshotIdentifier: 'profile-actor-MOBILE',
      ...snapshotOptions
    });
  });
});
