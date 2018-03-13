require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadQueryBuilder, type: :model do
  before do
    Api::V3::DownloadAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::DownloadAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end
  include_context 'api v3 brazil two flows'
  describe :query do
    before(:each) do
      Api::V3::Readonly::DownloadFlow.refresh
    end

    it 'should return all flows when no filter applied' do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, {})

      expected = [
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Imbituba', 'Afg Brasil', 'Unknown Customer', 'Russian Federation', 'DEFORESTATION', '10'],
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Paranagua', 'Afg Brasil 2', 'Chinatex Grains & Oils Imp Exp Co', 'China', 'DEFORESTATION', '5'],
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Paranagua', 'Afg Brasil 2', 'Chinatex Grains & Oils Imp Exp Co', 'China', 'ZERO DEFORESTATION', 'yes']
      ]
      actual = qb.flat_query.map do |f|
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
      expect(actual).to match_array(expected)
    end

    it 'should filter rows when filter applied' do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, exporters_ids: [api_v3_exporter1_node.id])

      expected = [
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Imbituba', 'Afg Brasil', 'Unknown Customer', 'Russian Federation', 'DEFORESTATION', '10']
      ]
      actual = qb.flat_query.map do |f|
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
      expect(actual).to match_array(expected)
    end
  end
end
