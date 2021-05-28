require 'rails_helper'

RSpec.describe Api::V3::MapAttributesExport do
  include_context 'api v3 brazil soy nodes'
  include_context 'api v3 quants'

  before(:all) {
    FileUtils.mkdir_p 'spec/support/export'
  }
  after(:all) {
    FileUtils.rm_rf 'spec/support/export'
  }

  describe :call do
    before(:each) do
      stub_const(
        'Api::V3::MapAttributesExport::EXPORT_DIR',
        'spec/support/export'
      )
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_municipality_node,
        quant: api_v3_land_conflicts,
        value: 5,
        year: 2015
      )
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_municipality2_node,
        quant: api_v3_land_conflicts,
        value: 10,
        year: 2015
      )
    end
    let(:subject) { Api::V3::MapAttributesExport.new }
    it 'should generate file' do
      filepath = 'spec/support/export/map_attributes_values_test.csv.gz'
      subject.call
      expect(File).to exist(filepath)
    end
  end
end
