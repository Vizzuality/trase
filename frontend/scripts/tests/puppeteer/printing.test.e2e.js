/* eslint-disable no-console,import/no-extraneous-dependencies */

import { Polly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { pollyConfig, handleUnnecesaryRequests } from './utils';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);

expect.extend({ toMatchImageSnapshot });

const BASE_URL = 'http://0.0.0.0:8081';
const TIMEOUT = process.env.PUPETEER_TIMEOUT || 30000;

jest.setTimeout(TIMEOUT);
const { page } = global;
const polly = new Polly('printing', pollyConfig(page));

beforeAll(async () => {
  await page.setRequestInterception(true);
  const { server } = polly;
  handleUnnecesaryRequests(server, BASE_URL);
});

afterAll(async () => {
  await polly.flush();
  await polly.stop();
});

const snapshotOptions = {
  failureThreshold: '0.05',
  failureThresholdType: 'percent'
};

describe('Prints the actor profile PDF correctly', () => {
  it('Prints actor profile - Full data', async () => {
    await page.goto(
      `${BASE_URL}/profile-actor?lang=en&nodeId=33624&contextId=1&year=2015&print=true`
    );
    const promises = [
      page.waitForSelector('[data-test=company-compare]'),
      page.waitForSelector('[data-test=top-destination-countries]'),
      page.waitForSelector('[data-test=top-destination-countries-map-d3-polygon-colored]'),
      page.waitForSelector('[data-test=top-sourcing-regions-map-d3-polygon-colored]')
    ];
    await Promise.all(promises);
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-actor-PDF',
      ...snapshotOptions
    });
  });

  it('Prints place profile PDF', async () => {
    await page.goto(
      `${BASE_URL}/profile-place?lang=en&nodeId=10902&contextId=1&year=2015&print=true`
    );
    const promises = [
      page.waitForSelector('[data-test=sustainability-indicators]'),
      page.waitForSelector('[data-test=deforestation-trajectory]'),
      page.waitForSelector('[data-test=top-traders]'),
      page.waitForSelector('[data-test=top-importers]')
    ];
    await Promise.all(promises);
    await page.emulateMedia('print');
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot({
      customSnapshotIdentifier: 'profile-place-PDF',
      ...snapshotOptions
    });
  });
});
