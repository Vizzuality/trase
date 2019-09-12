import parseURL from 'utils/parseURL';

describe('parseURL', () => {
  it('parses correctly', () => {
    const params = {
      a: '1',
      b: 'hi',
      c: '12.2343',
      d: '-12.13423',
      e: ['1', '2'],
      f: ['asdf', 'fdsa']
    };
    const parsedParams = {
      a: 1,
      b: 'hi',
      c: '12.2343',
      d: '-12.13423',
      e: [1, 2],
      f: ['asdf', 'fdsa']
    };
    expect(parseURL(params)).toStrictEqual(parsedParams);
  });
});
