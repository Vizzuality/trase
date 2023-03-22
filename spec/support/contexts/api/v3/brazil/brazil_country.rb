shared_context "api v3 brazil country" do
  let!(:api_v3_brazil) do
    Api::V3::Country.find_by_iso2("BR") || FactoryBot.create(
      :api_v3_country,
      name: "BRAZIL", iso2: "BR"
    )
  end
  let!(:api_v3_brazil_properties) do
    Api::V3::CountryProperty.find_by_country_id(api_v3_brazil.id) ||
      FactoryBot.create(
        :api_v3_country_property,
        country: api_v3_brazil,
        latitude: 23,
        longitude: 32,
        zoom: 4,
        annotation_position_x_pos: 10,
        annotation_position_y_pos: 20
      )
  end
end
