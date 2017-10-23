shared_context 'brazil exporter qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:zero_deforestation_value) {
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: zero_deforestation, value: 'NO')
  }

  let!(:zero_deforestation_link_value) {
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: zero_deforestation_link, value: 'HTTP://WWW.BUNGE.COM/CITIZENSHIP/SUSTAINABLE.HTML')
  }

  let!(:supply_change_value) {
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: supply_change, value: 'NO')
  }

  let!(:supply_change_link_value) {
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: supply_change_link, value: 'HTTP://SUPPLY-CHANGE.ORG/COMPANY/BUNGE')
  }

  let!(:rtrs_member_value) {
    FactoryGirl.create(:node_qual, node: exporter1_node, qual: rtrs_member, value: 'NO')
  }
end
