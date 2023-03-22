shared_context "api v3 commodities" do
  let!(:api_v3_soy) do
    Api::V3::Commodity.find_by_name("SOY") ||
      FactoryBot.create(:api_v3_commodity, name: "SOY")
  end

  let!(:api_v3_beef) do
    Api::V3::Commodity.find_by_name("BEEF") ||
      FactoryBot.create(:api_v3_commodity, name: "BEEF")
  end
end
