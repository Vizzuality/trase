import path from 'path';

const fs = require('fs');
const url = require('url');
const promisify = require('util').promisify;

require('dotenv').config({ silent: true });

const readFilePromise = promisify(fs.readFile);
const readdirPromise = promisify(fs.readdir);
const existsPromise = promisify(fs.exists);

const getMockList = async dirs => {
  const mocks = await Promise.all(
    dirs.map(async namespace => {
      const namespacePath = `${__dirname}/mocks/${namespace}`;
      try {
        await existsPromise(namespacePath);
      } catch (e) {
        throw new Error(`Realm ${namespace} could not be found`);
      }
      const filenames = await readdirPromise(namespacePath);
      return filenames.reduce(
        (acc, filename) => ({ ...acc, [filename]: `${namespacePath}/${filename}` }),
        {}
      );
    })
  );
  return mocks.reduce((acc, next) => ({ ...acc, ...next }), {});
};

export const getRequestMockFn = async files => {
  const namespaces = !Array.isArray(files) ? [files] : files;
  if (typeof process.env.API_V3_URL === 'undefined') {
    throw new Error('API_V3_URL needs to be defined');
  }

  const mocksList = await getMockList(namespaces);

  return async interceptedRequest => {
    const parsedUrl = url.parse(interceptedRequest.url());

    const dashedFile = parsedUrl.path
      .substr(1)
      .replace(/\/|\?|&|=/g, '-')
      .toLowerCase();
    const filePath =
      !dashedFile || dashedFile.endsWith('.json') ? dashedFile : `${dashedFile}.json`;
    if (typeof mocksList[filePath] !== 'undefined') {
      // console.info(`URL (${interceptedRequest.url()}) intercepted and response mocked`);
      const content = await readFilePromise(mocksList[filePath], 'utf8');

      return setTimeout(
        () =>
          interceptedRequest.respond({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: content
          }),
        1500
      );
    }

    // console.warn(`API request ${interceptedRequest.url()} not intercepted.`);
    return interceptedRequest.continue();
  };
};

export const openBrowser = visible => {
  if (visible) {
    jest.setTimeout(10000);
    return {
      headless: false,
      slowMo: 80,
      args: [`--window-size=1920,1080`]
    };
  }

  return { args: ['--no-sandbox'] };
};

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
  recordIfMissing:
    typeof process.env.JEST_CI !== 'undefined' ? !JSON.parse(process.env.JEST_CI) : true,
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

  server.any('https://tag.userreport.com/whoami').intercept((_, res) => {
    res.sendStatus(200);
    res.json({});
  });
};
