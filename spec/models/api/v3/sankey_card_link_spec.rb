require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  include_context 'api v3 brazil beef nodes'

  before do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:sankey_card_link) {
    FactoryBot.build(:api_v3_sankey_card_link)
  }

  describe :validate do
    let(:sankey_card_link_without_title) {
      FactoryBot.build(:api_v3_sankey_card_link, title: nil)
    }

    it 'fails when title blank' do
      expect(sankey_card_link_without_title).to have(1).errors_on(:title)
    end

    Api::V3::SankeyCardLink::LEVELS.each do |n|
      it "fails when there are more than #{Api::V3::SankeyCardLink::MAX_PER_LEVEL} for level#{n}" do
        FactoryBot.create_list(:api_v3_sankey_card_link, Api::V3::SankeyCardLink::MAX_PER_LEVEL, "level#{n}": true)

        sankey_card_link = FactoryBot.build(:api_v3_sankey_card_link, "level#{n}": true)
        expect(sankey_card_link).to have(1).errors_on(:"level#{n}")
      end
    end
  end

  describe :callbacks do
    describe 'before_validation' do
      describe '#extract_link_params' do
        it 'extract parameters from link' do
          sankey_card_link.update_attributes(
            link: "#{sankey_card_link.link}&selectedYears%5B%5D=2009"
          )
          expect(sankey_card_link.query_params).to include(
            'selectedYears' => ['2009']
          )
        end
      end

      describe '#extract_relations' do
        it 'extracts relations from the params' do
          sankey_card_link.update_attributes(
            link: "http://test.com?selectedCommodityId=#{api_v3_beef.id}&"\
                  "selectedCountryId=#{api_v3_brazil.id}"
          )

          expect(sankey_card_link.commodity_id).to eql api_v3_beef.id
          expect(sankey_card_link.country_id).to eql api_v3_brazil.id
        end
      end
    end
  end
end
