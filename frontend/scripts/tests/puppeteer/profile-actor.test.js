import puppeteer from 'puppeteer';

import mocks from '../mocks';

let page;
let browser;
const baseUrl = 'http://0.0.0.0:8081';

const openBrowser = visible =>
  visible
    ? {
        headless: false,
        slowMo: 80,
        args: [`--window-size=1920,1080`]
      }
    : { args: ['--no-sandbox'] };

beforeAll(async () => {
  browser = await puppeteer.launch(openBrowser(false));
  page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    const url = interceptedRequest
      .url()
      .replace('https:', '')
      .replace('http:', '');

    if (url in mocks) {
      console.info('Request intecepted by mocks: ', url);
      setTimeout(
        () =>
          interceptedRequest.respond({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(mocks[url])
          }),
        300
      );
    } else {
      console.warn('Request not intecepted by mocks: ', url);
      interceptedRequest.continue();
    }
  });
});

afterAll(() => {
  browser.close();
});

describe('Profile Root search', () => {
  test(
    'search for bunge and click importer result',
    async () => {
      const nodeName = 'bunge';
      const nodeType = 'importer';
      const profileType = 'actor';

      await page.goto(`${baseUrl}/profiles`);
      await page.waitForSelector('[data-test=profile-search]');
      await page.click('[data-test=search-input-desktop]');
      await page.type('[data-test=search-input-desktop]', nodeName);
      await page.waitForSelector(`[data-test=search-result-${nodeType}-${nodeName}]`);
      await page.click(`[data-test=search-result-${nodeType}-${nodeName}]`);

      expect(page.url().startsWith(`${baseUrl}/profile-${profileType}`)).toBe(true);

      expect.assertions(1);
    },
    30000
  );
});

describe('Profile actor', () => {
  test(
    'All 5 widget sections attempt to load',
    async done => {
      // await page.goto(`${baseUrl}/profile-actor?lang=en&nodeId=441&contextId=1&year=2015`);
      await page.waitForSelector('[data-test=loading-section]');
      const loadingSections = await page.$$('[data-test=loading-section]');
      expect(loadingSections.length).toBe(5);

      expect.assertions(1);

      done();
    },
    30000
  );

  test(
    'Summary widget loads successfully',
    async () => {
      await page.waitForSelector('[data-test=actor-summary]');
      const titleGroup = await page.$eval(
        '[data-test=title-group]',
        group => group.children.length
      );
      const companyName = await page.$eval(
        '[data-test=title-group-el-0]',
        title => title.textContent
      );
      const countryName = await page.$eval(
        '[data-test=title-group-el-1]',
        title => title.textContent
      );

      expect(titleGroup).toBe(4);
      expect(companyName.toLowerCase()).toMatch('bunge');
      expect(countryName.toLowerCase()).toMatch('brazil');

      expect.assertions(3);
    },
    30000
  );

  test(
    'Top destination countries chart loads successfully',
    async () => {
      await page.waitForSelector('[data-test=top-destination-countries]');
      const chartTitle = await page.$eval(
        '[data-test=top-destination-countries-chart-title]',
        el => el.textContent
      );
      const chartLines = await page.$$(
        '[data-test=top-destination-countries-chart-d3-line-points]'
      );

      expect(chartTitle.toLowerCase()).toMatch(
        'top destination countries of soy imported by bunge in 2015'
      );
      expect(chartLines.length).toBe(5);

      expect.assertions(2);
    },
    30000
  );

  test('Top destination countries map loads successfully', async () => {
    await page.waitForSelector('[data-test=top-destination-countries-map]');
    const hasLegend = await page.$eval(
      '[data-test=top-destination-countries-map-legend]',
      el => el !== null
    );
    const coloredMapPolygons = await page.$$(
      '[data-test=top-destination-countries-map-d3-polygon-colored]'
    );

    expect(hasLegend).toBe(true);
    expect(coloredMapPolygons.length).toBe(32);

    expect.assertions(2);
  });

  test(
    'Top sourcing regions chart loads successfully',
    async () => {
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

      expect.assertions(2);
    },
    30000
  );

  test('Top sourcing regions map loads successfully', async () => {
    await page.waitForSelector('[data-test=top-sourcing-regions-map]');
    const hasLegend = await page.$eval(
      '[data-test=top-sourcing-regions-map-legend]',
      el => el !== null
    );
    const coloredMapPolygons = await page.$$(
      '[data-test=top-sourcing-regions-map-d3-polygon-colored]'
    );

    expect(hasLegend).toBe(true);
    expect(coloredMapPolygons.length).toBe(908);

    expect.assertions(2);
  });

  test('Top sourcing regions switch changes map', async () => {
    await page.waitForSelector('[data-test=top-sourcing-regions-chart-switch]');
    const municipalityPolygons = await page.$$(
      '[data-test=top-sourcing-regions-map-d3-polygon-colored]'
    );
    expect(municipalityPolygons.length).toBe(908);

    await page.click('[data-test=top-sourcing-regions-chart-switch-item][data-key=biome]');
    const biomePolygons = await page.$$('[data-test=top-sourcing-regions-map-d3-polygon-colored]');

    expect(biomePolygons.length).toBe(6);

    expect.assertions(2);
  });

  test('Deforestation risk widget loads successfully', async () => {
    await page.waitForSelector('[data-test=deforestation-risk]');
    const tableTitle = await page.$eval(
      '[data-test=deforestation-risk-multi-switch-title]',
      el => el.textContent
    );
    const tabs = await page.$$('[data-test=deforestation-risk-multi-switch-item]');
    const columns = await page.$$eval(
      '[data-test=deforestation-risk-multi-table-header-name]',
      list => ({ length: list.length, firstCol: list[0].textContent })
    );
    const rows = await page.$$eval('[data-test=deforestation-risk-multi-table-row]', list => ({
      length: list.length,
      firstRow: list[0].textContent
    }));

    expect(tableTitle.toLowerCase()).toMatch(
      "deforestation risk associated with bunge's top sourcing regions in 2015:"
    );
    expect(tabs.length).toBe(2);
    expect(columns.length).toBe(4);
    expect(columns.firstCol).toMatch('Municipality');
    expect(rows.length).toBe(10);
    expect(rows.firstRow).toMatch('NOVA MUTUM218194N/A');
  });
});
