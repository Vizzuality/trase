require 'rails_helper'

RSpec.describe FlowDownloadQueryBuilder, type: :model do
  include_context "two flows"
  describe :query do
    before(:each) do
      MaterializedFlow.refresh
    end

    it "should return all flows when no filter applied" do
      qb = FlowDownloadQueryBuilder.new(context.id, {})
      expected = [
        ['TOTAL', 'Afg Brasil', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['TOTAL', 'Afg Brasil', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['TOTAL', 'Afg Brasil', 'Russian Federation', 'FOREST_500', '15'],
        ['TOTAL', 'Afg Brasil', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['TOTAL', 'Imbituba', 'Russian Federation', 'FOREST_500', '15'],
        ['TOTAL', 'Imbituba', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['TOTAL', 'Paranagua', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['TOTAL', 'Paranagua', 'China', 'ZERO_DEFORESTATION', 'yes'],

        ['AMAZONIA', 'Afg Brasil', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['AMAZONIA', 'Afg Brasil', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['AMAZONIA', 'Afg Brasil', 'Russian Federation', 'FOREST_500', '15'],
        ['AMAZONIA', 'Afg Brasil', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['AMAZONIA', 'Imbituba', 'Russian Federation', 'FOREST_500', '15'],
        ['AMAZONIA', 'Imbituba', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['AMAZONIA', 'Paranagua', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['AMAZONIA', 'Paranagua', 'China', 'ZERO_DEFORESTATION', 'yes'],

        ['MATO GROSSO', 'Afg Brasil', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['MATO GROSSO', 'Afg Brasil', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['MATO GROSSO', 'Afg Brasil', 'Russian Federation', 'FOREST_500', '15'],
        ['MATO GROSSO', 'Afg Brasil', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['MATO GROSSO', 'Imbituba', 'Russian Federation', 'FOREST_500', '15'],
        ['MATO GROSSO', 'Imbituba', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['MATO GROSSO', 'Paranagua', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['MATO GROSSO', 'Paranagua', 'China', 'ZERO_DEFORESTATION', 'yes'],

        ['CUIABA', 'Afg Brasil', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['CUIABA', 'Afg Brasil', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['CUIABA', 'Afg Brasil', 'Russian Federation', 'FOREST_500', '15'],
        ['CUIABA', 'Afg Brasil', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['CUIABA', 'Imbituba', 'Russian Federation', 'FOREST_500', '15'],
        ['CUIABA', 'Imbituba', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['CUIABA', 'Paranagua', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['CUIABA', 'Paranagua', 'China', 'ZERO_DEFORESTATION', 'yes'],

        ['Nova Ubirata', 'Afg Brasil', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['Nova Ubirata', 'Afg Brasil', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['Nova Ubirata', 'Afg Brasil', 'Russian Federation', 'FOREST_500', '15'],
        ['Nova Ubirata', 'Afg Brasil', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['Nova Ubirata', 'Imbituba', 'Russian Federation', 'FOREST_500', '15'],
        ['Nova Ubirata', 'Imbituba', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['Nova Ubirata', 'Paranagua', 'China', 'DEFORESTATION_V2 (USD)', '5'],
        ['Nova Ubirata', 'Paranagua', 'China', 'ZERO_DEFORESTATION', 'yes']
      ]

      expect(
        qb.flat_query.map{ |f| [f['Name'], f['Exporter'], f['Country of dest'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end

    it "should filter rows when filter applied" do
      qb = FlowDownloadQueryBuilder.new(context.id, {
        exporters_ids: [exporter1.id]
      })
      expected = [
        ['TOTAL', 'Russian Federation', 'FOREST_500', '15'],
        ['TOTAL', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['MATO GROSSO', 'Russian Federation', 'FOREST_500', '15'],
        ['MATO GROSSO', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['CUIABA', 'Russian Federation', 'FOREST_500', '15'],
        ['CUIABA', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['AMAZONIA', 'Russian Federation', 'FOREST_500', '15'],
        ['AMAZONIA', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10'],
        ['Nova Ubirata', 'Russian Federation', 'FOREST_500', '15'],
        ['Nova Ubirata', 'Russian Federation', 'DEFORESTATION_V2 (USD)', '10']
      ]
      expect(
        qb.flat_query.map{ |f| [f['Name'], f['Country of dest'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end
  end
end
