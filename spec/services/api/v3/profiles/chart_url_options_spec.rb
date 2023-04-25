require "rails_helper"

RSpec.describe Api::V3::Profiles::ChartUrlOptions do
  include_context "api v3 indonesia palm oil profiles"
  include_context "api v3 indonesia palm oil nodes"

  describe "url_options" do
    let(:params) {
      {
        context_id: api_v3_indonesia_context.id,
        commodity_id: api_v3_palm_oil.id,
        year: 2015
      }
    }
    context "when exporter country chart" do
      let(:chart) {
        FactoryBot.create(
          :api_v3_chart,
          identifier: :country_top_consumer_actors,
          profile: api_v3_indonesia_exporter_country_profile
        )
      }
      it "returns correct options" do
        options = Api::V3::Profiles::ChartUrlOptions.url_options(
          chart,
          params.merge(id: api_v3_indonesia_country_of_production_node.id),
          :exporter
        )
        expect(options[:params].keys).to match_array([:context_id, :year])
      end
    end

    context "when importer country chart" do
      let(:chart) {
        FactoryBot.create(
          :api_v3_chart,
          identifier: :country_top_consumer_actors,
          profile: api_v3_indonesia_importer_country_profile
        )
      }
      it "returns correct options" do
        options = Api::V3::Profiles::ChartUrlOptions.url_options(
          chart, params.merge(id: api_v3_indonesia_country_node.id), :importer
        )
        expect(options[:params].keys).to match_array([:commodity_id, :year])
      end
    end

    context "when place chart" do
      let(:chart) {
        FactoryBot.create(
          :api_v3_chart,
          identifier: :place_top_consumer_actors,
          profile: api_v3_indonesia_kabupaten_place_profile
        )
      }
      it "returns correct options" do
        options = Api::V3::Profiles::ChartUrlOptions.url_options(
          chart, params.merge(id: api_v3_indonesia_kabupaten_node.id), nil
        )
        expect(options[:params].keys).to match_array([:year])
      end
    end

    context "when actor chart" do
      let(:chart) {
        FactoryBot.create(
          :api_v3_chart,
          identifier: :actor_top_sources,
          profile: api_v3_indonesia_exporter_actor_profile
        )
      }
      it "returns correct options" do
        options = Api::V3::Profiles::ChartUrlOptions.url_options(
          chart, params.merge(id: api_v3_indonesia_exporter_node.id), :exporter
        )
        expect(options[:params].keys).to match_array([:year])
      end
    end
  end
end
