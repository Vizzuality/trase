require 'rails_helper'

RSpec.describe FlowDownloadQueryBuilder, type: :model do
  include_context "two flows"
  describe :query do
    before(:each) do
      MaterializedFlow.refresh
    end

    it "should return all flows when no filter applied" do
      qb = FlowDownloadQueryBuilder.new(context.id, {})
      expect(
        qb.query.map{ |f| [f[:node], f[:sum]] }
      ).to match_array(
        [
          [state.name, flow1_fob.value], [state.name, flow2_fob.value],
          [biome.name, flow1_fob.value], [biome.name, flow2_fob.value],
          [municipality.name.titleize, flow1_fob.value], [municipality.name.titleize, flow2_fob.value]
        ]
      )
    end

    it "should filter rows when filter applied" do
      qb = FlowDownloadQueryBuilder.new(context.id, {
        exporters_ids: [exporter1.id]
      })
      expect(
        qb.query.map{ |f| [f[:node], f[:sum]] }
      ).to match_array(
        [
          [state.name, flow1_fob.value], [biome.name, flow1_fob.value], [municipality.name.titleize, flow1_fob.value]
        ]
      )
    end
  end
end
