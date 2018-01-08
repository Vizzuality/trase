shared_context 'brazil exporter qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:exporter_zero_deforestation_value) do
    NodeQual.where(node_id: exporter1_node.id, qual_id: zero_deforestation.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: exporter1_node, qual: zero_deforestation, value: 'NO')
  end

  let!(:exporter_zero_deforestation_link_value) do
    NodeQual.where(node_id: exporter1_node.id, qual_id: zero_deforestation_link.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: exporter1_node, qual: zero_deforestation_link, value: 'HTTP://WWW.BUNGE.COM/CITIZENSHIP/SUSTAINABLE.HTML')
  end

  let!(:exporter_supply_change_value) do
    NodeQual.where(node_id: exporter1_node.id, qual_id: supply_change.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: exporter1_node, qual: supply_change, value: 'NO')
  end

  let!(:exporter_supply_change_link_value) do
    NodeQual.where(node_id: exporter1_node.id, qual_id: supply_change_link.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: exporter1_node, qual: supply_change_link, value: 'HTTP://SUPPLY-CHANGE.ORG/COMPANY/BUNGE')
  end

  let!(:exporter_rtrs_member_value) do
    NodeQual.where(node_id: exporter1_node.id, qual_id: rtrs_member.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: exporter1_node, qual: rtrs_member, value: 'NO')
  end
end
