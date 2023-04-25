shared_context "api v3 brazil recolor by attributes" do
  include_context "api v3 brazil soy context"
  include_context "api v3 quals"
  include_context "api v3 inds"

  let!(:api_v3_forest_500_recolor_by_attribute) do
    recolor_by_attribute = Api::V3::RecolorByInd.
      includes(:recolor_by_attribute).
      where(
        "recolor_by_attributes.context_id" => api_v3_brazil_soy_context.id,
        ind_id: api_v3_forest_500.id
      ).first&.recolor_by_attribute
    unless recolor_by_attribute
      recolor_by_attribute = FactoryBot.create(
        :api_v3_recolor_by_attribute,
        tooltip_text: "forest 500 tooltip text",
        context: api_v3_brazil_soy_context,
        position: 1,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false,
        legend_type: "stars",
        legend_color_theme: "red-blue"
      )
      FactoryBot.create(
        :api_v3_recolor_by_ind,
        recolor_by_attribute: recolor_by_attribute,
        ind: api_v3_forest_500
      )
    end
    recolor_by_attribute
  end

  let!(:api_v3_water_scarcity_recolor_by_attribute) do
    recolor_by_attribute = Api::V3::RecolorByInd.
      includes(:recolor_by_attribute).
      where(
        "recolor_by_attributes.context_id" => api_v3_brazil_soy_context.id,
        ind_id: api_v3_water_scarcity.id
      ).first&.recolor_by_attribute
    unless recolor_by_attribute
      recolor_by_attribute = FactoryBot.create(
        :api_v3_recolor_by_attribute,
        tooltip_text: "water scarcity tooltip text",
        context: api_v3_brazil_soy_context,
        position: 2,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false,
        legend_type: "linear",
        legend_color_theme: "red-blue"
      )
      FactoryBot.create(
        :api_v3_recolor_by_ind,
        recolor_by_attribute: recolor_by_attribute,
        ind: api_v3_water_scarcity
      )
    end
    recolor_by_attribute
  end

  let!(:api_v3_biome_recolor_by_attribute) do
    recolor_by_attribute = Api::V3::RecolorByQual.
      includes(:recolor_by_attribute).
      where(
        "recolor_by_attributes.context_id" => api_v3_brazil_soy_context.id,
        qual_id: api_v3_biome.id
      ).first&.recolor_by_attribute
    unless recolor_by_attribute
      recolor_by_attribute = FactoryBot.create(
        :api_v3_recolor_by_attribute,
        tooltip_text: "biome tooltip text",
        context: api_v3_brazil_soy_context,
        position: 3,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false,
        legend_type: "qual",
        legend_color_theme: "thematic"
      )
      FactoryBot.create(
        :api_v3_recolor_by_qual,
        recolor_by_attribute: recolor_by_attribute,
        qual: api_v3_biome
      )
    end
    recolor_by_attribute
  end
end
