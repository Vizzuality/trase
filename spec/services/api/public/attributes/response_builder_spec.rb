require "rails_helper"

RSpec.describe Api::Public::Attributes::ResponseBuilder do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh
    Api::Public::Readonly::FlowAttribute.refresh
  end

  describe :flow_attributes do
    context "when not filtering by country or commodity" do
      it "should return all flow attributes" do
        builder = Api::Public::Attributes::ResponseBuilder.new
        builder.call

        expect(builder.data.size).to eql(
          Api::V3::Readonly::Attribute.
            select("flow_quants.quant_id", "flows.context_id").
            joins("INNER JOIN flow_quants ON " \
                  "flow_quants.quant_id = attributes.original_id").
            joins("INNER JOIN flows ON flow_quants.flow_id = flows.id").
            group("flow_quants.quant_id", "flows.context_id").
            to_a.size
        )
      end
    end

    context "when filtering by country" do
      it "should return flow attributes for that country" do
        country = Api::V3::Country.first
        builder = Api::Public::Attributes::ResponseBuilder.new(
          country: country.iso2
        )
        builder.call

        returned_countries = builder.data.map do |fa|
          fa[:availability].map { |a| a["country"] }
        end.flatten.uniq
        expect(returned_countries).to eql [country.iso2]
      end
    end

    context "when filtering by commodity" do
      it "should return flow attributes for that commodity" do
        commodity = Api::V3::Commodity.first
        builder = Api::Public::Attributes::ResponseBuilder.new(
          commodity: commodity.name
        )
        builder.call

        returned_commodities = builder.data.map do |fa|
          fa[:availability].map { |a| a["commodity"] }
        end.flatten.uniq
        expect(returned_commodities).to eql [commodity.name]
      end
    end

    context "when commodity does not exist" do
      it "raise an error" do
        expect {
          Api::Public::Attributes::ResponseBuilder.new(commodity: "ARM")
        }.to raise_error("Commodity not found")
      end
    end

    context "when country does not exist" do
      it "raise an error" do
        expect {
          Api::Public::Attributes::ResponseBuilder.new(country: "MOON")
        }.to raise_error("Country not found")
      end
    end
  end
end
