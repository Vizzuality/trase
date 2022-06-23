class AddSubnationalYearsToContextProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :context_properties, :subnational_years, 'INT[]'
    update_view :contexts_v, version: 3, revert_to_version: 2, materialized: false
    update_view :nodes_with_flows_v, version: 4, revert_to_version: 3, materialized: false

    reversible do |dir|
      dir.up do
        execute 'UPDATE context_properties SET subnational_years = contexts.subnational_years FROM contexts WHERE contexts.id = context_properties.context_id'
      end
      dir.down do |dir|
      end
    end
  end
end
