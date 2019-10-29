namespace :sankey_card_links do
  desc 'Rename biome_id to node_id'
  task rename_biome: [:environment] do
    Api::V3::SankeyCardLink.where.not(node_id: nil).each do |sankey_card_link|
      query_params = sankey_card_link.query_params
      node = Api::V3::Node.find_by(
        name: query_params['selectedBiomeFilterName']
      )
      query_params['extraColumnNodeId'] = node.id
      query_params.delete 'selectedBiomeFilterName'

      sankey_card_link.update_attribute(
        :query_params,
        query_params
      )
    end
  end
end
