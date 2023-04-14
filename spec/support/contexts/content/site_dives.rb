shared_context "site dives" do
  let!(:site_dive_1) do
    FactoryBot.create(:site_dive, title: "Site dive title", description: "Site dive description", page_url: "https://supplychains.trase.earth")
  end
end
