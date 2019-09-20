require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  let(:sankey_card_link) {
    FactoryBot.build(:api_v3_sankey_card_link)
  }

  describe :validate do
    let(:sankey_card_link_without_host) {
      FactoryBot.build(:api_v3_sankey_card_link, host: nil)
    }
    let(:sankey_card_link_without_query_params) {
      FactoryBot.build(:api_v3_sankey_card_link, query_params: nil)
    }
    let(:sankey_card_link_without_title) {
      FactoryBot.build(:api_v3_sankey_card_link, title: nil)
    }

    it 'fails when host blank' do
      expect(sankey_card_link_without_host).to have(1).errors_on(:host)
    end

    it 'fails when query_params blank' do
      expect(sankey_card_link_without_query_params).to have(1).errors_on(:query_params)
    end

    it 'fails when title blank' do
      expect(sankey_card_link_without_title).to have(1).errors_on(:title)
    end
  end

  describe :methods do
    describe '#link' do
      it 'return complete link' do
        expect(sankey_card_link.link).to eql(
          "#{sankey_card_link.host}?#{sankey_card_link.query_params.to_query}"
        )
      end
    end
  end

  describe :callbacks do
    describe 'before_save' do
      describe '#extract_link_params' do
        it 'extract parameters from link' do
          sankey_card_link.update_attributes(title: 'test', link_param: 'http://test.com?one=1')
          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.query_params).to eql({'one' => '1'})
        end
      end
    end
  end
end
