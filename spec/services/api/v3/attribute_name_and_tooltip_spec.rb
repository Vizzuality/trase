require "rails_helper"

RSpec.describe Api::V3::AttributeNameAndTooltip, :service do
  include_context "minimal config for tooltips"
  Sidekiq::Testing.inline!

  describe :call do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh
    end

    let(:ro_chart_attribute) {
      Api::V3::Readonly::ChartAttribute.find_by(original_type: type)
    }

    subject do
      Api::V3::AttributeNameAndTooltip.call(
        context: context,
        attribute: ro_chart_attribute.readonly_attribute,
        defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(ro_chart_attribute.display_name, ro_chart_attribute.tooltip_text)
      )
    end

    context "inds" do
      before(:each) do
        Api::V3::IndContextProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::IndCountryProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::IndCommodityProperty.set_callback(:create, :after, :refresh_dependents_after_create)
      end

      after(:each) do
        Api::V3::IndContextProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::IndCountryProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::IndCommodityProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
      end

      let(:type) { "Ind" }

      it "returns context specific tooltip if there is one for that context and attribute" do
        ind_context_property
        ind_country_property
        expect(subject.tooltip_text).to eq(context_tooltip_text)
      end

      it "returns country specific tooltip if there is no context one" do
        ind_country_property
        ind_commodity_property
        expect(subject.tooltip_text).to eq(country_tooltip_text)
      end

      it "returns commodity specific tooltip if there is no context nor country one" do
        ind_commodity_property
        expect(subject.tooltip_text).to eq(commodity_tooltip_text)
      end

      it "returns the tooltip defined in (ind|quant|qual)_property" do
        expect(subject.tooltip_text).to eq(ro_chart_attribute.tooltip_text)
      end
    end

    context "quants" do
      before(:each) do
        Api::V3::QuantContextProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QuantCountryProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QuantCommodityProperty.set_callback(:create, :after, :refresh_dependents_after_create)
      end

      after(:each) do
        Api::V3::QuantContextProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QuantCountryProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QuantCommodityProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
      end

      let(:type) { "Quant" }

      it "returns context specific tooltip if there is one for that context and attribute" do
        quant_context_property
        quant_country_property
        expect(subject.tooltip_text).to eq(context_tooltip_text)
      end

      it "returns country specific tooltip if there is no context one" do
        quant_country_property
        quant_commodity_property
        expect(subject.tooltip_text).to eq(country_tooltip_text)
      end

      it "returns commodity specific tooltip if there is no context nor country one" do
        quant_commodity_property
        expect(subject.tooltip_text).to eq(commodity_tooltip_text)
      end

      it "returns the tooltip defined in (ind|quant|qual)_property" do
        expect(subject.tooltip_text).to eq(ro_chart_attribute.tooltip_text)
      end
    end

    context "quals" do
      before(:each) do
        Api::V3::QualContextProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QualCountryProperty.set_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QualCommodityProperty.set_callback(:create, :after, :refresh_dependents_after_create)
      end

      after(:each) do
        Api::V3::QualContextProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QualCountryProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
        Api::V3::QualCommodityProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
      end

      let(:type) { "Qual" }

      it "returns context specific tooltip if there is one for that context and attribute" do
        qual_context_property
        qual_country_property
        expect(subject.tooltip_text).to eq(context_tooltip_text)
      end

      it "returns country specific tooltip if there is no context one" do
        qual_country_property
        qual_commodity_property
        expect(subject.tooltip_text).to eq(country_tooltip_text)
      end

      it "returns commodity specific tooltip if there is no context nor country one" do
        qual_commodity_property
        expect(subject.tooltip_text).to eq(commodity_tooltip_text)
      end

      it "returns the tooltip defined in (ind|quant|qual)_property" do
        expect(subject.tooltip_text).to eq(ro_chart_attribute.tooltip_text)
      end
    end
  end
end
