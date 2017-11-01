shared_context 'brazil exporter qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:zero_deforestation_value) do
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: zero_deforestation, value: 'NO')
  end

  let!(:zero_deforestation_link_value) do
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: zero_deforestation_link, value: 'HTTP://WWW.BUNGE.COM/CITIZENSHIP/SUSTAINABLE.HTML')
  end

  let!(:supply_change_value) do
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: supply_change, value: 'NO')
  end

  let!(:supply_change_link_value) do
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: supply_change_link, value: 'HTTP://SUPPLY-CHANGE.ORG/COMPANY/BUNGE')
  end

  let!(:rtrs_member_value) do
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: rtrs_member, value: 'NO')
  end
end
