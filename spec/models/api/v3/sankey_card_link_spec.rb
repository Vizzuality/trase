require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  describe :validate do
    let(:sankey_card_link_without_link) {
      FactoryBot.build(:api_v3_sankey_card_link, link: nil)
    }
    let(:sankey_card_link_without_title) {
      FactoryBot.build(:api_v3_sankey_card_link, title: nil)
    }

    it 'fails when link blank' do
      expect(sankey_card_link_without_link).to have(1).errors_on(:link)
    end

    it 'fails when title blank' do
      expect(sankey_card_link_without_title).to have(1).errors_on(:title)
    end
  end
end
