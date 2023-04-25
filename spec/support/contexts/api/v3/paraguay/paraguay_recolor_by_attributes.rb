shared_context "api v3 paraguay recolor by attributes" do
  include_context "api v3 paraguay context"
  include_context "api v3 quals"

  let!(:api_v3_paraguay_biome_recolor_by_attribute) do
    recolor_by_attribute = Api::V3::RecolorByQual.
      includes(:recolor_by_attribute).
      where(
        "recolor_by_attributes.context_id" => api_v3_paraguay_context.id,
        qual_id: api_v3_biome.id
      ).first&.recolor_by_attribute
    unless recolor_by_attribute
      recolor_by_attribute = FactoryBot.create(
        :api_v3_recolor_by_attribute,
        tooltip_text: "biome tooltip text",
        context: api_v3_paraguay_context,
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
