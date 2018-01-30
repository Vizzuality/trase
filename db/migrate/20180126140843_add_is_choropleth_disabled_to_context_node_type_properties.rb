class AddIsChoroplethDisabledToContextNodeTypeProperties < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      add_column :context_node_type_properties, :is_choropleth_disabled, :boolean, null: false, default: false
    end
  end
end
