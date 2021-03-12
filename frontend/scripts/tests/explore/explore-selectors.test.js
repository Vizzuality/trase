import {
  getCardsWithRecentCard,
  getRecentCard
} from 'react-components/explore/explore.selectors.js';

const validCountryId = 1;
const validCommodityId = 2;

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

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns recent card if it has a valid context', () => {
      Storage.prototype.getItem = jest.fn(() => `${validCountryId}-${validCommodityId}`);
      const validRecentCard = getRecentCard();
      expect(getCardsWithRecentCard(state)).toStrictEqual(validRecentCard);
    });
  });
});
