require 'rails_helper'

RSpec.describe Api::V3::Import::Importer do
  include_context 'minimum complete configuration'
  let(:source_schema) { 'source' }
  let(:database_update) { FactoryBot.create(:api_v3_database_update) }

  context 'destroys widows' do
    before(:each) do
      # prepare source schema
      ActiveRecord::Base.connection.execute("CREATE SCHEMA #{source_schema}")
      # copy all blue tables to source schema
      Api::V3::BlueTable.subclasses.each do |subclass|
        ActiveRecord::Base.connection.execute(
          <<~SQL
            CREATE TABLE #{source_schema}.#{subclass.table_name}
            AS SELECT * FROM #{subclass.table_name}
          SQL
        )
      end
      # introduce future widow
      dummy_quant = FactoryBot.create(:api_v3_quant, name: 'DUMMY')
      @widow = FactoryBot.create(:api_v3_download_attribute)
      FactoryBot.create(
        :api_v3_download_quant, quant: dummy_quant, download_attribute: @widow
      )
    end

    subject { Api::V3::Import::Importer.new(database_update, source_schema) }

    it 'does not restore the widow' do
      subject.call
      expect(Api::V3::DownloadAttribute.exists?(@widow.id)).to be(false)
    end
  end
end
