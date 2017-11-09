shared_context 'site dives' do
  let!(:site_dive_1) do
    FactoryGirl.create(:site_dive, title: 'Site dive title', description: 'Site dive description', page_url: 'https://trase.earth')
  end
end
