import path from 'path';

require('dotenv').config({ silent: true });

export const pollyConfig = page => ({
  adapters: ['puppeteer'],
  adapterOptions: {
    puppeteer: {
      page
    }
  },
  persister: 'fs',
  persisterOptions: {
    fs: {
      recordingsDir: path.join(__dirname, '__recordings__')
    }
  },
  recordIfMissing: true,
  matchRequestsBy: {
    method: false,
    headers: false,
    body: false,
    order: false,
    url: {
      protocol: true,
      username: false,
      password: false,
      hostname: true,
      port: true,
      pathname: true,
      query: true,
      hash: false
    }
  }
});

export const handleUnnecesaryRequests = (server, BASE_URL) => {
  server.host(BASE_URL, () => {
    server.get('/favicon.ico').passthrough();
    server.get('/sockjs-node/*').intercept((_, res) => {
      res.sendStatus(200);
      res.json({});
    });
  });

  server.any('http://clsrv.transifex.com/').intercept((_, res) => {
    res.sendStatus(200);
    res.json({});
  });

  server.any('https://cdn.plyr.io/*').intercept((_, res) => {
    res.sendStatus(200);
    res.json({});
  });

  server.any('http://live-detector.svc.transifex.net/').intercept((_, res) => {
    res.sendStatus(200);
    res.json({});
  });

  server.any('https://tag.userreport.com/whoami').intercept((_, res) => {
    res.sendStatus(200);
    res.json({});
  });
};

export const expectToContain = async (page, selector, text) => {
  const selectorText = await page.$eval(`[data-test=${selector}]`, el => el.textContent);
  expect(selectorText).toContain(text);
};

export const click = async (page, selector) => {
  const testSelector = `[data-test=${selector}]`;
  await page.waitForSelector(testSelector);
  await page.click(testSelector);
};

export const expectChildrenToBe = async (page, selector, number) => {
  const testSelector = `[data-test=${selector}]`;
  await page.waitForSelector(testSelector);
  const topCardsNumber = await page.$eval(testSelector, group => group.children.length);

  expect(topCardsNumber).toBe(number);
};
