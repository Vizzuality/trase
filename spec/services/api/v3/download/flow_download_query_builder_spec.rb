require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadQueryBuilder, type: :model do
  include_context 'api v3 brazil two flows'
  describe :query do
    before(:each) do
      Api::V3::Readonly::DownloadFlow.refresh(sync: true)
    end

    let(:flow1_potential_deforestation_row) {
      [
        2015,
        'Nova Ubirata',
        'MATO GROSSO',
        'AMAZONIA',
        'Imbituba',
        'Afg Brasil',
        'Unknown Customer',
        'Russian Federation',
        'DEFORESTATION',
        '10'
      ]
    }
    let(:flow1_zero_deforestation_row) {
      [
        2015,
        'Nova Ubirata',
        'MATO GROSSO',
        'AMAZONIA',
        'Imbituba',
        'Afg Brasil',
        'Unknown Customer',
        'Russian Federation',
        'ZERO DEFORESTATION',
        'no'
      ]
    }
    let(:flow2_potential_deforestation_row) {
      [
        2015,
        'Nova Ubirata',
        'MATO GROSSO',
        'AMAZONIA',
        'Paranagua',
        'Afg Brasil 2',
        'Chinatex Grains & Oils Imp Exp Co',
        'China',
        'DEFORESTATION',
        '5'
      ]
    }
    let(:flow2_zero_deforestation_row) {
      [
        2015,
        'Nova Ubirata',
        'MATO GROSSO',
        'AMAZONIA',
        'Paranagua',
        'Afg Brasil 2',
        'Chinatex Grains & Oils Imp Exp Co',
        'China',
        'ZERO DEFORESTATION',
        'yes'
      ]
    }

    it 'should return all flows when no filter applied' do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, {})

      expected = [
        flow1_potential_deforestation_row,
        flow1_zero_deforestation_row,
        flow2_potential_deforestation_row,
        flow2_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end

    it 'should filter rows when filter applied' do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, e_ids: [api_v3_exporter1_node.id])

      expected = [
        flow1_potential_deforestation_row,
        flow1_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end

    it 'should filter rows using advanced filter' do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(
        api_v3_context,
        filters: [
          {name: api_v3_zero_deforestation.name, op: 'eq', val: 'yes'},
          {name: api_v3_deforestation_v2.name, op: 'gt', val: '5'}
        ]
      )

      expected = [
        flow1_potential_deforestation_row,
        flow2_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end
  end

  def query_to_row(query)
    query.all.map do |f|
      [
        f['YEAR'],
        f['MUNICIPALITY'],
        f['STATE'],
        f['BIOME'],
        f['PORT'],
        f['EXPORTER'],
        f['IMPORTER'],
        f['COUNTRY'],
        f['INDICATOR'],
        f['TOTAL']
      ]
    end
  end
end
