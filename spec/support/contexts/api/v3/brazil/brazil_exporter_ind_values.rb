shared_context "api v3 brazil exporter ind values" do
  include_context "api v3 inds"
  include_context "api v3 brazil soy nodes"

  let!(:api_v3_exporter_forest_500_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_exporter1_node.id, ind_id: api_v3_forest_500.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_exporter1_node,
        ind: api_v3_forest_500,
        value: 4
      )
  end
end
