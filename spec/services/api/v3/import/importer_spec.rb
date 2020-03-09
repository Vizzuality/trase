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

  context 'refresh sankey cards' do
    subject { Api::V3::Import::Importer.new(database_update, source_schema) }
    let(:link) {
      "http://localhost:8081/flows?countries=#{context.country_id}&commodities=#{context.commodity_id}"
    }

    context 'when node id changes' do
      before(:each) do
        @source_id = municipality_node.id
        node_attributes = {
          name: municipality_node.name,
          node_type_id: municipality_node.node_type_id,
          main_id: municipality_node.main_id
        }
        municipality_node.delete

        new_node = FactoryBot.create(:api_v3_node, node_attributes)
        @local_id = new_node.id

        @card = FactoryBot.create(
          :api_v3_sankey_card_link,
          level3: true,
          link: link + "&selectedNodesIds[]=#{@local_id}"
        )

        @card_with_excluded = FactoryBot.create(
          :api_v3_sankey_card_link,
          level3: true,
          link: link + "&sources=excluded_#{@local_id}"
        )

        Sidekiq::Testing.inline! do
          subject.call
        end
      end
      it 'updates nodes ids in query_params' do
        expect(@card.reload.query_params['selectedNodesIds']).to eq([@source_id])
      end

      it 'updates nodes ids in link' do
        uri = URI.parse @card.reload.link
        query_params = Rack::Utils.parse_nested_query(uri.query)
        expect(query_params['selectedNodesIds']).to eq([@source_id.to_s])
      end

      it 'updates excluded nodes ids in query_params' do
        expect(
          @card_with_excluded.reload.query_params['sources']
        ).to eq("excluded_#{@source_id}")
      end
    end

    context 'when node id disappears' do
      before(:each) do
        new_node = FactoryBot.create(:api_v3_node)
        @local_id = new_node.id

        @card = FactoryBot.create(
          :api_v3_sankey_card_link,
          level3: true,
          link: link + "&selectedNodesIds[]=#{@local_id}"
        )

        Sidekiq::Testing.inline! do
          subject.call
        end
      end

      it 'updates nodes ids in query_params' do
        expect(@card.reload.query_params['selectedNodesIds']).to be_nil
      end

      it 'updates nodes ids in link' do
        uri = URI.parse @card.reload.link
        query_params = Rack::Utils.parse_nested_query(uri.query)
        expect(query_params['selectedNodesIds']).to be_nil
      end
    end

    context 'when node type id changes' do
      before(:each) do
        @source_id = municipality_node_type.id
        node_type_attributes = {name: municipality_node_type.name}
        municipality_node_type.delete

        new_node_type = FactoryBot.create(
          :api_v3_node_type, node_type_attributes
        )
        @local_id = new_node_type.id

        @card = FactoryBot.create(
          :api_v3_sankey_card_link,
          level3: true,
          link: link + "&selectedColumnsIds=0_#{@local_id}"
        )

        Sidekiq::Testing.inline! do
          subject.call
        end
      end
      it 'updates node types ids in query_params' do
        expect(@card.reload.query_params['selectedColumnsIds']).to eq("0_#{@source_id}")
      end

      it 'updates nodes types ids in link' do
        uri = URI.parse @card.reload.link
        query_params = Rack::Utils.parse_nested_query(uri.query)
        expect(query_params['selectedColumnsIds']).to eq("0_#{@source_id}")
      end
    end

    context 'when node type id disappears from source' do
      before(:each) do
        new_node_type = FactoryBot.create(:api_v3_node_type, name: 'TEST')
        @local_id = new_node_type.id

        @card = FactoryBot.create(
          :api_v3_sankey_card_link,
          level3: true,
          link: link + "&selectedColumnsIds=0_#{@local_id}"
        )

        Sidekiq::Testing.inline! do
          subject.call
        end
      end

      it 'updates nodes types ids in query_params' do
        expect(@card.reload.query_params['selectedColumnsIds']).to be_nil
      end

      it 'updates nodes types ids in link' do
        uri = URI.parse @card.reload.link
        query_params = Rack::Utils.parse_nested_query(uri.query)
        expect(query_params['selectedColumnsIds']).to be_nil
      end
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
