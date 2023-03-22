shared_context "api v3 brazil contextual layers" do
  include_context "api v3 brazil soy context"

  let!(:api_v3_contextual_layer_landcover) do
    contextual_layer = Api::V3::ContextualLayer.find_by_identifier("landcover")
    unless contextual_layer
      contextual_layer = FactoryBot.create(
        :api_v3_contextual_layer,
        context_id: api_v3_brazil_soy_context.id,
        title: "Land cover",
        identifier: "landcover",
        tooltip_text: "Land cover",
        is_default: false,
        legend: "<div class='cartodb-legend custom'><ul class='bullets'><li><div class='bullet' style='background:#008156'></div>Forest</li><li><div class='bullet' style='background:#556B2F'></div>Forest plantations</li><li><div class='bullet' style='background:#E1E196'></div>Pastures</li><li><div class='bullet' style='background:#E1A500'></div>Agriculture</li><li><div class='bullet' style='background:#00FFFF'></div>Coastal forest</li><li><div class='bullet' style='background:#00AFFF'></div>Water</li><li><div class='bullet' style='background:#F5F5F3'></div>Other vegetation</li><li><div class='bullet' style='background:#3E3F40'></div>Not observed</li></ul></div>",
        position: 0
      )
      FactoryBot.create(
        :api_v3_carto_layer,
        contextual_layer: contextual_layer,
        identifier: "landcover"
      )
    end
    contextual_layer
  end

  let!(:api_v3_contextual_layer_brazil_biomes) do
    contextual_layer = Api::V3::ContextualLayer.find_by_identifier("brazil_biomes")
    unless contextual_layer
      contextual_layer = FactoryBot.create(
        :api_v3_contextual_layer,
        context_id: api_v3_brazil_soy_context.id,
        title: "Brazil biomes",
        identifier: "brazil_biomes",
        tooltip_text: "Brazil biomes",
        is_default: false,
        position: 1
      )
      FactoryBot.create(
        :api_v3_carto_layer,
        contextual_layer: contextual_layer,
        identifier: "brazil_biomes"
      )
    end
    contextual_layer
  end
end
