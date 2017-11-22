class RemoveUpdatedAtFromBlueTables < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def change
    with_search_path('revamp') do
      remove_column :countries, :updated_at, :datetime
      remove_column :commodities, :updated_at, :datetime
      remove_column :contexts, :updated_at, :datetime
      remove_column :node_types, :updated_at, :datetime
      remove_column :context_node_types, :updated_at, :datetime
      remove_column :nodes, :updated_at, :datetime
      remove_column :flows, :updated_at, :datetime
      remove_column :inds, :updated_at, :datetime
      remove_column :quals, :updated_at, :datetime
      remove_column :quants, :updated_at, :datetime
      remove_column :node_inds, :updated_at, :datetime
      remove_column :node_quals, :updated_at, :datetime
      remove_column :node_quants, :updated_at, :datetime
      remove_column :flow_inds, :updated_at, :datetime
      remove_column :flow_quals, :updated_at, :datetime
      remove_column :flow_quants, :updated_at, :datetime
      remove_column :download_versions, :updated_at, :datetime
    end
  end
end
