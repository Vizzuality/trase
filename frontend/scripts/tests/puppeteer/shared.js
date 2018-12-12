const BASE_URL = 'http://0.0.0.0:8081';

export async function testRootSearch(page, expect, { nodeName, nodeType, profileType }) {
  const profileSearchInputSelector = '[data-test=profile-root-search-input-field-lg]';

  await page.waitForSelector(profileSearchInputSelector);
  await page.click(profileSearchInputSelector);
  await page.type(profileSearchInputSelector, nodeName);
  await page.waitForSelector(`[data-test=search-result-${nodeType}-${nodeName}]`);
  await page.click(`[data-test=search-result-${nodeType}-${nodeName}]`);
  expect(page.url().startsWith(`${BASE_URL}/profile-${profileType}`)).toBe(true);
}

export async function testProfileSpinners(page, expect) {
  const loadingSectionSelector = '[data-test=loading-section]';

  await page.waitForSelector(loadingSectionSelector);
  const loadingSections = await page.$$(loadingSectionSelector);
  expect(loadingSections.length).toBe(5);
}

export async function testProfileSummary(page, expect, { titles, profileType, titlesLength }) {
  await page.waitForSelector(`[data-test=${profileType}-summary]`);
  const titleGroup = await page.$eval('[data-test=title-group]', group => group.children.length);
  const first = await page.$eval('[data-test=title-group-el-0]', title => title.textContent);
  const second = await page.$eval('[data-test=title-group-el-1]', title => title.textContent);

  expect(titleGroup).toBe(titlesLength);
  expect(first.toLowerCase()).toMatch(titles[0]);
  expect(second.toLowerCase()).toMatch(titles[1]);
}

export async function testProfileMultiTable(
  page,
  expect,
  { testId, title, tabsLength, columnsLength, rowsLength, firstColumn, firstRow }
) {
  await page.waitForSelector(`[data-test=${testId}]`);
  const tableTitle = await page.$eval(
    `[data-test=${testId}-multi-switch-title]`,
    el => el.textContent
  );
  const tabs = await page.$$(`[data-test=${testId}-multi-switch-item]`);
  const columns = await page.$$eval(`[data-test=${testId}-multi-table-header-name]`, list => ({
    length: list.length,
    firstCol: list[0].textContent
  }));
  const rows = await page.$$eval(`[data-test=${testId}-multi-table-row]`, list => ({
    length: list.length,
    firstRow: list[0].textContent
  }));

  expect(tableTitle.toLowerCase()).toMatch(title);
  expect(tabs.length).toBe(tabsLength);
  expect(columns.length).toBe(columnsLength);
  expect(columns.firstCol.toLowerCase()).toMatch(firstColumn);
  expect(rows.length).toBe(rowsLength);
  expect(rows.firstRow).toMatch(firstRow);
}

export async function testProfileMiniSankey(page, expect, { testId, title, flowsLength }) {
  await page.waitForSelector(`[data-test=${testId}]`);
  const miniSankeyTitle = await page.$eval(`[data-test=${testId}-title]`, el => el.textContent);
  const miniSankeyFlows = await page.$$(`[data-test=${testId}-mini-sankey-flow]`, flows => flows);

  expect(miniSankeyTitle.toLowerCase()).toMatch(title);
  expect(miniSankeyFlows.length).toBe(flowsLength);
}
