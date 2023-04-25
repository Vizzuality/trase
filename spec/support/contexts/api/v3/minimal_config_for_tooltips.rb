shared_context "minimal config for tooltips" do
  include_context "minimum complete configuration"

  ### Boilerplate

  let!(:chart) { FactoryBot.create(:api_v3_chart, profile: place_profile) }

  let!(:chart_attribute) {
    FactoryBot.create(
      :api_v3_chart_attribute,
      chart: chart
    )
  }

  let!(:chart_attribute2) {
    FactoryBot.create(
      :api_v3_chart_attribute,
      chart: chart
    )
  }

  let!(:chart_attribute3) {
    FactoryBot.create(
      :api_v3_chart_attribute,
      chart: chart
    )
  }

  let!(:chart_ind) {
    FactoryBot.create(
      :api_v3_chart_ind,
      chart_attribute: chart_attribute,
      ind: ind
    )
  }

  let!(:chart_quant) {
    FactoryBot.create(
      :api_v3_chart_quant,
      chart_attribute: chart_attribute2,
      quant: quant
    )
  }

  let!(:chart_qual) {
    FactoryBot.create(
      :api_v3_chart_qual,
      chart_attribute: chart_attribute3,
      qual: qual
    )
  }

  ### Context specific

  let(:context_tooltip_text) { "Context specific tooltip text" }
  let(:ind_context_property) {
    FactoryBot.create(
      :api_v3_ind_context_property,
      context: context,
      ind: ind,
      tooltip_text: context_tooltip_text
    )
  }

  let(:quant_context_property) {
    FactoryBot.create(
      :api_v3_quant_context_property,
      context: context,
      quant: quant,
      tooltip_text: context_tooltip_text
    )
  }

  let(:qual_context_property) {
    FactoryBot.create(
      :api_v3_qual_context_property,
      context: context,
      qual: qual,
      tooltip_text: context_tooltip_text
    )
  }

  ### Country specific

  let(:country_tooltip_text) { "Country specific tooltip text" }

  let(:ind_country_property) {
    FactoryBot.create(
      :api_v3_ind_country_property,
      country_id: context.country_id,
      ind: ind,
      tooltip_text: country_tooltip_text
    )
  }

  let(:quant_country_property) {
    FactoryBot.create(
      :api_v3_quant_country_property,
      country_id: context.country_id,
      quant: quant,
      tooltip_text: country_tooltip_text
    )
  }

  let(:qual_country_property) {
    FactoryBot.create(
      :api_v3_qual_country_property,
      country_id: context.country_id,
      qual: qual,
      tooltip_text: country_tooltip_text
    )
  }

  ### Commodity specific

  let(:commodity_tooltip_text) { "Commodity specific tooltip text" }

  let(:ind_commodity_property) {
    FactoryBot.create(
      :api_v3_ind_commodity_property,
      commodity_id: context.commodity_id,
      ind: ind,
      tooltip_text: commodity_tooltip_text
    )
  }

  let(:quant_commodity_property) {
    FactoryBot.create(
      :api_v3_quant_commodity_property,
      commodity_id: context.commodity_id,
      quant: quant,
      tooltip_text: commodity_tooltip_text
    )
  }

  let(:qual_commodity_property) {
    FactoryBot.create(
      :api_v3_qual_commodity_property,
      commodity_id: context.commodity_id,
      qual: qual,
      tooltip_text: commodity_tooltip_text
    )
  }
end
