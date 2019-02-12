/* eslint-disable no-console */

import { toMatchImageSnapshot } from 'jest-image-snapshot';
import path from 'path';
import {
  CONTEXTS,
  PROFILE_NODE_ACTOR,
  PROFILE_NODE_PLACE
} from './mocks';
import { getRequestMockFn } from './utils';
expect.extend({ toMatchImageSnapshot });

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = 60000 || process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;

beforeAll(async () => {
  await page.setRequestInterception(true);
  const mockRequests = await getRequestMockFn([CONTEXTS, PROFILE_NODE_ACTOR, PROFILE_NODE_PLACE]);
  page.on('request', mockRequests);
});

describe('Prints the PDF correctly', () => {
  it('Prints actor profile - Full data', async () => {
    await page.goto(`${BASE_URL}/profile-actor?lang=en&nodeId=441&contextId=1&year=2015&print=true`);
    await page.waitForSelector('[data-test=company-compare]');
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-actor',
      customSnapshotsDir: path.join(__dirname, 'snapshot')
    });
  });

  it('Prints Place profile - Full data', async () => {
    await page.goto(`${BASE_URL}/profile-place?lang=en&nodeId=2759&contextId=1&year=2015&print=true`);
    await page.waitForSelector('[data-test=sustainability-indicators]');
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-place',
      customSnapshotsDir: path.join(__dirname, 'snapshot')
    });
  });
});
