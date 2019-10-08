require 'rails_helper'

RSpec.describe Api::V3::Import::Importer do
  include_context 'minimum complete configuration'
  let(:source_schema) { 'source' }
  let(:database_update) { FactoryBot.create(:api_v3_database_update) }

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
  end

  context 'refresh attributes years' do
    subject { Api::V3::Import::Importer.new(database_update, source_schema) }

    before :each do
      download_attribute.update_attribute(:years, nil)
      resize_by_attribute.update_attribute(:years, nil)
      recolor_by_attribute.update_attribute(:years, nil)

      Sidekiq::Testing.inline! do
        subject.call
      end
    end

    it 'update years on attributes' do
      download_attribute.reload
      resize_by_attribute.reload
      recolor_by_attribute.reload

      expect(download_attribute.years).to eql [2014]
      expect(resize_by_attribute.years).to eql [2014]
      expect(recolor_by_attribute.years).to eql [2014]
    end
  end

  context 'destroys zombies' do
    before(:each) do
      # introduce future zombie
      dummy_quant = FactoryBot.create(:api_v3_quant, name: 'DUMMY')
      @zombie = FactoryBot.create(:api_v3_download_attribute)
      FactoryBot.create(
        :api_v3_download_quant, quant: dummy_quant, download_attribute: @zombie
      )
    end

    subject { Api::V3::Import::Importer.new(database_update, source_schema) }

    it 'does not restore the zombie' do
      subject.call
      expect(Api::V3::DownloadAttribute.exists?(@zombie.id)).to be(false)
    end
  end
end
