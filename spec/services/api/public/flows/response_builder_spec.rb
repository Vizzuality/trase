require "rails_helper"

RSpec.describe Api::Public::Flows::ResponseBuilder do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh
  end

  describe :flows do
    context "when not filtering by country or commodity" do
      it "should return all flows" do
        builder = Api::Public::Flows::ResponseBuilder.new
        query = builder.call

        expect(query.size).to eql(
          Api::V3::Flow.
            select("flows.year", "flows.path").
            joins("INNER JOIN flow_quants ON flow_quants.flow_id = flows.id").
            joins("INNER JOIN attributes ON attributes.original_type = 'Quant' AND "\
                  "                         attributes.original_id = flow_quants.quant_id").
            group("flows.id", "flows.year", "flows.path").
            size
        )
      end
    end

    context "when filtering by country" do
      it "should return flow attributes for that country" do
        country = Api::V3::Country.first
        builder = Api::Public::Flows::ResponseBuilder.new(
          country: country.iso2
        )
        query = builder.call

        expect(query.size).to eql(
          Api::V3::Flow.
            select("flows.year", "flows.path").
            joins("INNER JOIN contexts ON contexts.id = flows.context_id").
            joins("INNER JOIN flow_quants ON flow_quants.flow_id = flows.id").
            joins("INNER JOIN attributes ON attributes.original_type = 'Quant' AND "\
                  "                         attributes.original_id = flow_quants.quant_id").
            where("contexts.country_id = ?", country.id).
            group("flows.id", "flows.year", "flows.path").
            size
        )
      end
    end

    context "when filtering by commodity" do
      it "should return flow attributes for that commodity" do
        commodity = Api::V3::Commodity.first
        builder = Api::Public::Flows::ResponseBuilder.new(
          commodity: commodity.name
        )
        query = builder.call

        expect(query.size).to eql(
          Api::V3::Flow.
            select("flows.year", "flows.path").
            joins("INNER JOIN contexts ON contexts.id = flows.context_id").
            joins("INNER JOIN flow_quants ON flow_quants.flow_id = flows.id").
            joins("INNER JOIN attributes ON attributes.original_type = 'Quant' AND "\
                  "                         attributes.original_id = flow_quants.quant_id").
            where("contexts.commodity_id = ?", commodity.id).
            group("flows.id", "flows.year", "flows.path").
            size
        )
      end
    end

    context "when commodity does not exist" do
      it "raise an error" do
        expect {
          Api::Public::Flows::ResponseBuilder.new(commodity: "ARM")
        }.to raise_error("Commodity not found")
      end
    end

    context "when country does not exist" do
      it "raise an error" do
        expect {
          Api::Public::Flows::ResponseBuilder.new(country: "MOON")
        }.to raise_error("Country not found")
      end
    end
  end
end
