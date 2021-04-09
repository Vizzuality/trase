require 'rails_helper'

RSpec.describe Api::V3::NodeAttributeRanking do
  include_context 'api v3 indonesia palm oil nodes'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 inds'

  let(:year) { 2020 }

  describe :call do
    before(:each) do
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_indonesia_country_of_production_node,
        ind: api_v3_human_development_index,
        value: 0.7,
        year: year
      )
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_brazil_beef_country_of_production_node,
        ind: api_v3_human_development_index,
        value: 0.8,
        year: year
      )
    end
    let(:subject) {
      Api::V3::NodeAttributeRanking.new(api_v3_indonesia_country_of_production_node, year)
    }
    it 'rank should be 2' do
      rank = subject.call(api_v3_human_development_index)
      expect(rank).to eq(2)
    end
  end
end
