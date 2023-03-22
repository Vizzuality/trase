shared_context "api v3 paraguay country" do
  let!(:api_v3_paraguay) do
    Api::V3::Country.find_by_iso2("PY") || FactoryBot.create(
      :api_v3_country,
      name: "PARAGUAY", iso2: "PY"
    )
  end
  let!(:api_v3_paraguay_properties) do
    Api::V3::CountryProperty.find_by_country_id(api_v3_paraguay.id) ||
      FactoryBot.create(
        :api_v3_country_property,
        country: api_v3_paraguay,
        latitude: -23.44,
        longitude: -58.44,
        zoom: 4,
        annotation_position_x_pos: 10,
        annotation_position_y_pos: 20
      )
  end
end
