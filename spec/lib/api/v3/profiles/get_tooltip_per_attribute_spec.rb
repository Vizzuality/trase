require 'rails_helper'

RSpec.describe Api::V3::Profiles::GetTooltipPerAttribute, :service do
  include_context 'minimal config for tooltips'

  describe :call do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh
      Api::V3::Readonly::ChartAttribute.refresh
    end

    def refresh_dependent_materialized_views
      Api::V3::Readonly::CountryAttributeProperty.refresh
      Api::V3::Readonly::ContextAttributeProperty.refresh
      Api::V3::Readonly::CommodityAttributeProperty.refresh
    end

    let(:ro_chart_attribute) {
      Api::V3::Readonly::ChartAttribute.find_by(original_type: type)
    }

    subject do
      Api::V3::Profiles::GetTooltipPerAttribute.call(
        context: context,
        ro_chart_attribute: ro_chart_attribute
      )
    end

    context 'inds' do
      let(:type) { 'Ind' }

      it 'returns context specific tooltip if there is one for that context and attribute' do
        ind_context_property
        ind_country_property
        refresh_dependent_materialized_views
        expect(subject).to eq(context_tooltip_text)
      end

      it 'returns country specific tooltip if there is no context one' do
        ind_country_property
        ind_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(country_tooltip_text)
      end

      it 'returns commodity specific tooltip if there is no context nor country one' do
        ind_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(commodity_tooltip_text)
      end

      it 'returns the tooltip defined in (ind|quant|qual)_property' do
        refresh_dependent_materialized_views
        expect(subject).to eq(ro_chart_attribute.tooltip_text)
      end
    end

    context 'quants' do
      let(:type) { 'Quant' }

      it 'returns context specific tooltip if there is one for that context and attribute' do
        quant_context_property
        quant_country_property
        refresh_dependent_materialized_views
        expect(subject).to eq(context_tooltip_text)
      end

      it 'returns country specific tooltip if there is no context one' do
        quant_country_property
        quant_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(country_tooltip_text)
      end

      it 'returns commodity specific tooltip if there is no context nor country one' do
        quant_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(commodity_tooltip_text)
      end

      it 'returns the tooltip defined in (ind|quant|qual)_property' do
        refresh_dependent_materialized_views
        expect(subject).to eq(ro_chart_attribute.tooltip_text)
      end
    end

    context 'quals' do
      let(:type) { 'Qual' }

      it 'returns context specific tooltip if there is one for that context and attribute' do
        qual_context_property
        qual_country_property
        refresh_dependent_materialized_views
        expect(subject).to eq(context_tooltip_text)
      end

      it 'returns country specific tooltip if there is no context one' do
        qual_country_property
        qual_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(country_tooltip_text)
      end

      it 'returns commodity specific tooltip if there is no context nor country one' do
        qual_commodity_property
        refresh_dependent_materialized_views
        expect(subject).to eq(commodity_tooltip_text)
      end

      it 'returns the tooltip defined in (ind|quant|qual)_property' do
        refresh_dependent_materialized_views
        expect(subject).to eq(ro_chart_attribute.tooltip_text)
      end
    end
  end
end
