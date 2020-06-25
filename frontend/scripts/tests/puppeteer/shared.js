import last from 'lodash/last';
import qs from 'qs';

const BASE_URL = 'http://0.0.0.0:8081';

export async function testRootSearch(page, { nodeName, nodeType, profileType }) {
  const profileSearchInputSelector = '[data-test=profiles-search-input-field-lg]';
  await page.waitForSelector(profileSearchInputSelector);
  await page.click(profileSearchInputSelector);
  await page.type(profileSearchInputSelector, nodeName);
  await page.waitForSelector(`[data-test=search-result-${nodeType}-${nodeName}]`);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 }),
    page.click(`[data-test=search-result-${nodeType}-${nodeName}]`)
  ]);
  const url = page.url();
  expect(url.startsWith(`${BASE_URL}/profile-${profileType}`)).toBe(true);
}

export async function testProfileSummary(page, { title, params, profileType, titlesLength }) {
  const waitPromises = [
    page.waitForSelector(`[data-test=${profileType}-summary]`),
    page.waitForSelector('[data-test=title-group-el-1]')
  ];

  const contentPromises = [page.$eval('[data-test=title-group]', group => group.children.length)];

  params.forEach((p, i) => {
    contentPromises.push(page.$eval(`[data-test=title-group-el-${i}]`, param => param.textContent));
  });

  if (title) {
    waitPromises.push(page.waitForSelector('[data-test=profiles-title]'));
    contentPromises.push(page.$eval('[data-test=profiles-title]', t => t.textContent));
  }

  await Promise.all(waitPromises);
  const promiseResult = await Promise.all(contentPromises);

  if (title) {
    expect(last(promiseResult)).toBe(title);
  }

  expect(promiseResult[0]).toBe(titlesLength);

  params.forEach((p, i) => {
    expect(promiseResult[i + 1].toLowerCase()).toMatch(params[i]);
  });
}

export async function testProfileMultiTable(
  page,
  {
    testId,
    title,
    tabsLength,
    columnsLength,
    rowsLength,
    firstColumn,
    firstRow,
    linkName,
    linkQuery
  }
) {
  await page.waitForSelector(`[data-test=${testId}]`);
  const [tableTitle, tabs, columns, rows] = await Promise.all([
    await page.$eval(`[data-test=${testId}-multi-switch-title]`, el => el.textContent),
    page.$$(`[data-test=${testId}-multi-switch-item]`),
    page.$$eval(`[data-test=${testId}-multi-table-header-name]`, list => ({
      length: list.length,
      firstCol: list[0].textContent
    })),
    page.$$eval(`[data-test=${testId}-multi-table-row]`, list => ({
      length: list.length,
      firstRow: list[0].textContent
    }))
  ]);

  if (linkName) {
    const links = await page.$$eval(`[data-test=${testId}-multi-table-cell-link]`, list => ({
      length: list.length,
      firstLink: list[0].href
    }));

    expect(links.length).toBe(rowsLength);
    expect(links.firstLink.split('?')[0]).toMatch(BASE_URL + linkName);
    expect(qs.parse(links.firstLink.split('?')[1])).toEqual(linkQuery);
  }

  expect(tableTitle.toLowerCase()).toMatch(title);
  expect(tabs.length).toBe(tabsLength);
  expect(columns.length).toBe(columnsLength);
  expect(columns.firstCol.toLowerCase()).toMatch(firstColumn);
  expect(rows.length).toBe(rowsLength);
  expect(rows.firstRow).toMatch(firstRow);
}

export async function testProfileMiniSankey(page, { testId, title, flowsLength }) {
  await Promise.all([
    page.waitForSelector(`[data-test=${testId}]`),
    page.waitForSelector(`[data-test=${testId}-mini-sankey-flow]`)
  ]);
  const [miniSankeyTitle, miniSankeyFlows] = await Promise.all([
    page.$eval(`[data-test=${testId}-title]`, el => el.textContent),
    page.$$(`[data-test=${testId}-mini-sankey-flow]`, flows => flows)
  ]);

  expect(miniSankeyTitle.toLowerCase()).toMatch(title);
  expect(miniSankeyFlows.length).toBe(flowsLength);
  await Promise.resolve();
}
