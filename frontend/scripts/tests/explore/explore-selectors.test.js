import { getCardsWithRecentCard, getRecentCard } from 'react-components/explore/explore.selectors.js';
const validCountryId = 1;
const validCommodityId = 2;
const invalidCountryId = 1000;
const invalidCommodityId = 1000;

describe('Explore selectors', () => {
  describe('getCardsWithRecentCard', () => {
    const state = {
      app: {
        contexts: [
          {
            name: 'valid-context',
            countryId: validCountryId,
            commodityId: validCommodityId
          }
        ]
      },
      explore: {
        sankeyCards: { data: [], meta: [] }
      }
    };

    const selector = getCardsWithRecentCard;
    beforeEach(() => {
      selector.resetAllComputations;
      jest.resetAllMocks();
    });

    const setMock = (countryId, commodityId) => jest.fn(() => `${countryId}-${commodityId}`);
    it('returns recent card if it has a valid context', () => {
        Storage.prototype.getItem = setMock(validCountryId, validCommodityId);
        const validRecentCard = getRecentCard();
        expect(selector(state)).toStrictEqual(validRecentCard);
        localStorage.setItem('recentCard', '');
      });

      xit('returns no cards if it has a non existing context', () => {
        Storage.prototype.getItem = setMock(invalidCountryId, invalidCommodityId);
        expect(selector(state)).toStrictEqual({ data: [], meta: [] });
      });
  });
});
