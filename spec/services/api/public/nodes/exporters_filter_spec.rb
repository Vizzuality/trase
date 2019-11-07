require 'rails_helper'

RSpec.describe Api::Public::Nodes::Exporters::Filter do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef flows'

  before(:each) do
    Api::V3::Readonly::Context.refresh(sync: true)
    Api::V3::Readonly::Node.refresh(sync: true)
  end

  describe :call do
    context 'when filtering by country' do
      let(:filter) {
        Api::Public::Nodes::Exporters::Filter.new(
          commodity_id: api_v3_soy.id
        )
      }
      it 'returns nodes with availability by commodity' do
        nodes = filter.call
        ru = nodes.find do |n|
          n[:id] == api_v3_exporter1_node.id
        end
        expect(ru[:availability]).not_to be_empty
      end
    end
    context 'when filtering by name' do
      let(:filter) {
        Api::Public::Nodes::Exporters::Filter.new(
          name: 'BRA'
        )
      }

      it 'matches on any word' do
        nodes = filter.call
        ru_idx = nodes.index do |n|
          n[:id] == api_v3_exporter1_node.id
        end

        expect(ru_idx).not_to be_nil
      end
    end
  end
end
