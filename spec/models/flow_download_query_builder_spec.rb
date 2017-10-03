require 'rails_helper'

RSpec.describe FlowDownloadQueryBuilder, type: :model do
  include_context "two flows"
  describe :query do
    before(:each) do
      MaterializedFlow.refresh
    end

    it "should return all flows when no filter applied" do
      qb = FlowDownloadQueryBuilder.new(context, {})
      expected = [
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Imbituba', 'Afg Brasil', 'Unknown Customer', 'Russian Federation', 'MAX_SOY_DEFORESTATION', '10'],
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Paranagua', 'Afg Brasil', 'Chinatex Grains & Oils Imp Exp Co', 'China', 'MAX_SOY_DEFORESTATION', '5'],
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Paranagua', 'Afg Brasil', 'Chinatex Grains & Oils Imp Exp Co', 'China', 'ZERO_DEFORESTATION', 'yes']
      ]

      expect(
        qb.flat_query.map{ |f| [f['Year'], f['Municipality'], f['State'], f['Biome'], f['Port'], f['Exporter'], f['Importer'], f['Country'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end

    it "should filter rows when filter applied" do
      qb = FlowDownloadQueryBuilder.new(context, {
        exporters_ids: [exporter1.id]
      })
      expected = [
        [2015, 'Nova Ubirata', 'MATO GROSSO', 'AMAZONIA', 'Imbituba', 'Afg Brasil', 'Unknown Customer', 'Russian Federation', 'MAX_SOY_DEFORESTATION', '10']
      ]

      expect(
        qb.flat_query.map{ |f| [f['Year'], f['Municipality'], f['State'], f['Biome'], f['Port'], f['Exporter'], f['Importer'], f['Country'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end
  end
end
