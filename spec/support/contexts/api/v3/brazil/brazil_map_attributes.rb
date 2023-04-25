shared_context "api v3 brazil map attributes" do
  include_context "api v3 brazil soy context"
  include_context "api v3 inds"
  include_context "api v3 quants"
  include_context "api v3 brazil map attribute groups"

  let!(:api_v3_water_scarcity_map_attribute) do
    map_attribute = Api::V3::MapInd.
      includes(:map_attribute).
      where(
        "map_attributes.map_attribute_group_id" => api_v3_map_attribute_group1.id,
        ind_id: api_v3_water_scarcity.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group1,
        position: 8,
        dual_layer_buckets: [4, 5, 6],
        single_layer_buckets: [3, 4, 5, 6],
        color_scale: "bluered"
      )
      FactoryBot.create(
        :api_v3_map_ind,
        map_attribute: map_attribute,
        ind: api_v3_water_scarcity
      )
    end
    map_attribute
  end

  let!(:api_v3_gdp_per_capita_map_attribute) do
    map_attribute = Api::V3::MapInd.
      includes(:map_attribute).
      where(
        "map_attributes.map_attribute_group_id" => api_v3_map_attribute_group2.id,
        ind_id: api_v3_gdp_per_capita.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group2,
        position: 17,
        dual_layer_buckets: [10_000, 30_000, 50_000],
        single_layer_buckets: [10_000, 20_000, 50_000, 100_000],
        color_scale: "blue"
      )
      FactoryBot.create(
        :api_v3_map_ind,
        map_attribute: map_attribute,
        ind: api_v3_gdp_per_capita
      )
    end
    map_attribute
  end

  let!(:api_v3_land_conflicts_map_attribute) do
    map_attribute = Api::V3::MapQuant.
      includes(:map_attribute).
      where(
        "map_attributes.map_attribute_group_id" => api_v3_map_attribute_group1.id,
        quant_id: api_v3_land_conflicts.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group1,
        position: 21,
        dual_layer_buckets: [6, 10, 15],
        single_layer_buckets: [1, 3, 7, 15],
        years: [2014, 2015],
        color_scale: "red"
      )
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: map_attribute,
        quant: api_v3_land_conflicts
      )
    end
    map_attribute
  end

  let!(:api_v3_force_labour_map_attribute) do
    map_attribute = Api::V3::MapQuant.
      includes(:map_attribute).
      where(
        "map_attributes.map_attribute_group_id" => api_v3_map_attribute_group2.id,
        quant_id: api_v3_force_labour.id
      ).first&.map_attribute
    unless map_attribute
      map_attribute = FactoryBot.create(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group2,
        position: 20,
        dual_layer_buckets: [2, 3, 5],
        single_layer_buckets: [1, 2, 4, 5],
        color_scale: "red"
      )
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: map_attribute,
        quant: api_v3_force_labour
      )
    end
    map_attribute
  end
end
