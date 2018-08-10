import mocks from './mocks';

export const mockRequests = interceptedRequest => {
  const url = interceptedRequest
    .url()
    .replace('https:', '')
    .replace('http:', '');

  if (url in mocks) {
    console.warn(`URL (${url}) intercepted and response mocked`);
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
    interceptedRequest.continue();
  }
};

export const openBrowser = visible =>
  visible
    ? {
        headless: false,
        slowMo: 80,
        args: [`--window-size=1920,1080`]
      }
    : { args: ['--no-sandbox'] };
