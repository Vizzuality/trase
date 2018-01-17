class AddOnUpdateToForeignKeys < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      remove_foreign_key :contexts, :countries
      add_foreign_key :contexts, :countries, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :country_properties, :countries
      add_foreign_key :country_properties, :countries, {on_delete: :cascade, on_update: :cascade}

      remove_foreign_key :contexts, :commodities
      add_foreign_key :contexts, :commodities, {on_delete: :cascade, on_update: :cascade}

      remove_foreign_key :node_inds, :inds
      add_foreign_key :node_inds, :inds, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :flow_inds, :inds
      add_foreign_key :flow_inds, :inds, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :recolor_by_inds, :inds
      add_foreign_key :recolor_by_inds, :inds, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :map_inds, :inds
      add_foreign_key :map_inds, :inds, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :chart_inds, :inds
      add_foreign_key :chart_inds, :inds, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :ind_properties, :inds
      add_foreign_key :ind_properties, :inds, {on_delete: :cascade, on_update: :cascade}

      remove_foreign_key :node_quals, :quals
      add_foreign_key :node_quals, :quals, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :flow_quals, :quals
      add_foreign_key :flow_quals, :quals, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :recolor_by_quals, :quals
      add_foreign_key :recolor_by_quals, :quals, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :download_quals, :quals
      remove_foreign_key :chart_quals, :quals
      add_foreign_key :chart_quals, :quals, {on_delete: :cascade, on_update: :cascade}
      add_foreign_key :download_quals, :quals, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :qual_properties, :quals
      add_foreign_key :qual_properties, :quals, {on_delete: :cascade, on_update: :cascade}

      remove_foreign_key :node_quants, :quants
      add_foreign_key :node_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :flow_quants, :quants
      add_foreign_key :flow_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :resize_by_quants, :quants
      add_foreign_key :resize_by_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :map_quants, :quants
      add_foreign_key :map_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :chart_quants, :quants
      add_foreign_key :chart_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :download_quants, :quants
      add_foreign_key :download_quants, :quants, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :quant_properties, :quants
      add_foreign_key :quant_properties, :quants, {on_delete: :cascade, on_update: :cascade}

      remove_foreign_key :flow_inds, :flows
      add_foreign_key :flow_inds, :flows, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :flow_quals, :flows
      add_foreign_key :flow_quals, :flows, {on_delete: :cascade, on_update: :cascade}
      remove_foreign_key :flow_quants, :flows
      add_foreign_key :flow_quants, :flows, {on_delete: :cascade, on_update: :cascade}
    end
  end
end
