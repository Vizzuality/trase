const fs = require('fs');
const url = require('url');

const asyncReadFile = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });

export const mockRequests = mockRealms => {
  if (typeof process.env.API_V3_URL === 'undefined') {
    throw new Error('API_V3_URL needs to be defined');
  }

  if (!Array.isArray(mockRealms)) {
    mockRealms = [mockRealms];
  }

  const mocksList = {};

  mockRealms.forEach(mockRealm => {
    const realmPath = `${__dirname}/mocks/${mockRealm}`;

    if (!fs.existsSync(realmPath)) {
      throw new Error(`Realm ${mockRealm} could not be found`);
    }

    fs.readdir(realmPath, (err, filenames) => {
      filenames.forEach(filename => {
        mocksList[filename] = `${realmPath}/${filename}`;
      });
    });
  });

  return async interceptedRequest => {
    const parsedUrl = url.parse(interceptedRequest.url());

    if (parsedUrl.host !== url.parse(process.env.API_V3_URL).host) {
      interceptedRequest.continue();
      return;
    }

    const filePath = `${parsedUrl.path
      .substr(1)
      .replace(/\/|\?|&|=/g, '-')
      .toLowerCase()}.json`;

    if (Object.keys(mocksList).includes(filePath)) {
      console.info(`URL (${interceptedRequest.url()}) intercepted and response mocked`);
      const content = await asyncReadFile(mocksList[filePath]);

      setTimeout(
        () =>
          interceptedRequest.respond({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: content
          }),
        300
      );
    } else {
      console.warn(`API request ${interceptedRequest.url()} with key ${filePath} not intercepted.`);

      console.log(Object.keys(mocksList));

      interceptedRequest.continue();
    }
  };
};

export const openBrowser = visible =>
  visible
    ? {
        headless: false,
        slowMo: 80,
        args: [`--window-size=1920,1080`]
      }
    : { args: ['--no-sandbox'] };
