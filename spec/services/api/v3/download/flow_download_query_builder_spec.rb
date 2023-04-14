require "rails_helper"

RSpec.describe Api::V3::Download::FlowDownloadQueryBuilder, type: :model do
  include_context "api v3 brazil two flows"
  describe :query do
    before do
      allow(
        Api::V3::Download::PrecomputedDownload
      ).to receive(:refresh)
    end

    before(:each) do
      Api::V3::Readonly::Attribute.refresh(skip_dependencies: true, skip_dependents: true)
      Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
      Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    end

    let(:flow1_potential_deforestation_row) {
      [
        2015,
        "NOVA UBIRATA",
        "MATO GROSSO",
        "AMAZONIA",
        "IMBITUBA",
        "AFG BRASIL",
        "AGROGRAIN",
        "RUSSIAN FEDERATION",
        "DEFORESTATION",
        "10"
      ]
    }
    let(:flow1_zero_deforestation_row) {
      [
        2015,
        "NOVA UBIRATA",
        "MATO GROSSO",
        "AMAZONIA",
        "IMBITUBA",
        "AFG BRASIL",
        "AGROGRAIN",
        "RUSSIAN FEDERATION",
        "ZERO DEFORESTATION",
        "no"
      ]
    }
    let(:flow2_potential_deforestation_row) {
      [
        2015,
        "NOVA UBIRATA",
        "MATO GROSSO",
        "AMAZONIA",
        "PARANAGUA",
        "AFG BRASIL 2",
        "CHINATEX GRAINS & OILS IMP EXP CO",
        "CHINA",
        "DEFORESTATION",
        "15"
      ]
    }
    let(:flow2_zero_deforestation_row) {
      [
        2015,
        "NOVA UBIRATA",
        "MATO GROSSO",
        "AMAZONIA",
        "PARANAGUA",
        "AFG BRASIL 2",
        "CHINATEX GRAINS & OILS IMP EXP CO",
        "CHINA",
        "ZERO DEFORESTATION",
        "yes"
      ]
    }

    it "should return all flows when no filter applied" do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_brazil_soy_context, {})

      expected = [
        flow1_potential_deforestation_row,
        flow1_zero_deforestation_row,
        flow2_potential_deforestation_row,
        flow2_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end

    it "should filter rows when filter applied" do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_brazil_soy_context, e_ids: [api_v3_exporter1_node.id])

      expected = [
        flow1_potential_deforestation_row,
        flow1_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end

    it "should filter rows using advanced filter" do
      qb = Api::V3::Download::FlowDownloadQueryBuilder.new(
        api_v3_brazil_soy_context,
        filters: [
          {name: api_v3_zero_deforestation.name, op: "eq", val: "yes"},
          {name: api_v3_deforestation_v2.name, op: "gt", val: "10"}
        ]
      )

      expected = [
        flow2_potential_deforestation_row,
        flow2_zero_deforestation_row
      ]
      actual = query_to_row(qb.flat_query)
      expect(actual).to match_array(expected)
    end
  end

  def query_to_row(query)
    query.all.map do |f|
      [
        f["YEAR"],
        f["MUNICIPALITY"],
        f["STATE"],
        f["BIOME"],
        f["PORT"],
        f["EXPORTER"],
        f["IMPORTER"],
        f["COUNTRY"],
        f["INDICATOR"],
        f["TOTAL"]
      ]
    end
  end
end
