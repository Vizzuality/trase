require 'rails_helper'

RSpec.describe Api::V3::Dashboards::FilterSources do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil soy goias flows'
  include_context 'api v3 paraguay flows'

  describe :call_with_query_term do
    before(:each) do
      Api::V3::Readonly::Dashboards::FlowPath.refresh(sync: true)
      Api::V3::Readonly::Dashboards::Source.refresh(sync: true)
    end
    let(:filter) { Api::V3::Dashboards::FilterSources.new({}) }

    it 'exact match is on top' do
      nodes = filter.call_with_query_term('GOIAS')
      expect(nodes.first.name).to eq(api_v3_municipality_goias.name)
    end
  end
end
