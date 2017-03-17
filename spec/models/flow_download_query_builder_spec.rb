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
        ['TOTAL', 'China', 'TOTAL_DEFOR_RATE (USD)', '5'],
        ['TOTAL', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['TOTAL', 'Russian Federation', 'FOREST_500', '15'],
        ['TOTAL', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['MATO GROSSO', 'China', 'TOTAL_DEFOR_RATE (USD)', '5'],
        ['MATO GROSSO', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['MATO GROSSO', 'Russian Federation', 'FOREST_500', '15'],
        ['MATO GROSSO', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['AMAZONIA', 'China', 'TOTAL_DEFOR_RATE (USD)', '5'],
        ['AMAZONIA', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['AMAZONIA', 'Russian Federation', 'FOREST_500', '15'],
        ['AMAZONIA', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['Nova Ubirata', 'China', 'TOTAL_DEFOR_RATE (USD)', '5'],
        ['Nova Ubirata', 'China', 'ZERO_DEFORESTATION', 'yes'],
        ['Nova Ubirata', 'Russian Federation', 'FOREST_500', '15'],
        ['Nova Ubirata', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10']
      ]
      expect(
        qb.flat_query.map{ |f| [f['Name'], f['Country of dest'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end

    it "should filter rows when filter applied" do
      qb = FlowDownloadQueryBuilder.new(context.id, {
        exporters_ids: [exporter1.id]
      })
      expected = [
        ['TOTAL', 'Russian Federation', 'FOREST_500', '15'],
        ['TOTAL', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['MATO GROSSO', 'Russian Federation', 'FOREST_500', '15'],
        ['MATO GROSSO', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['AMAZONIA', 'Russian Federation', 'FOREST_500', '15'],
        ['AMAZONIA', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10'],
        ['Nova Ubirata', 'Russian Federation', 'FOREST_500', '15'],
        ['Nova Ubirata', 'Russian Federation', 'TOTAL_DEFOR_RATE (USD)', '10']
      ]
      expect(
        qb.flat_query.map{ |f| [f['Name'], f['Country of dest'], f['Indicator'], f['Total' ]] }
      ).to match_array(expected)
    end
  end
end
