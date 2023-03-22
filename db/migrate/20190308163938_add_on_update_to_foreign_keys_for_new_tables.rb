class AddOnUpdateToForeignKeysForNewTables < ActiveRecord::Migration[5.2]
  def change
    # Inds
    remove_foreign_key :ind_context_properties, :inds
    remove_foreign_key :ind_context_properties, :contexts
    add_foreign_key :ind_context_properties, :inds, on_delete: :cascade, on_update: :cascade
    add_foreign_key :ind_context_properties, :contexts, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :ind_country_properties, :inds
    remove_foreign_key :ind_country_properties, :countries
    add_foreign_key :ind_country_properties, :inds, on_delete: :cascade, on_update: :cascade
    add_foreign_key :ind_country_properties, :countries, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :ind_commodity_properties, :inds
    remove_foreign_key :ind_commodity_properties, :commodities
    add_foreign_key :ind_commodity_properties, :inds, on_delete: :cascade, on_update: :cascade
    add_foreign_key :ind_commodity_properties, :commodities, on_delete: :cascade, on_update: :cascade

    # Quants
    remove_foreign_key :quant_context_properties, :quants
    remove_foreign_key :quant_context_properties, :contexts
    add_foreign_key :quant_context_properties, :quants, on_delete: :cascade, on_update: :cascade
    add_foreign_key :quant_context_properties, :contexts, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :quant_country_properties, :quants
    remove_foreign_key :quant_country_properties, :countries
    add_foreign_key :quant_country_properties, :quants, on_delete: :cascade, on_update: :cascade
    add_foreign_key :quant_country_properties, :countries, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :quant_commodity_properties, :quants
    remove_foreign_key :quant_commodity_properties, :commodities
    add_foreign_key :quant_commodity_properties, :quants, on_delete: :cascade, on_update: :cascade
    add_foreign_key :quant_commodity_properties, :commodities, on_delete: :cascade, on_update: :cascade

    # Quals
    remove_foreign_key :qual_context_properties, :quals
    remove_foreign_key :qual_context_properties, :contexts
    add_foreign_key :qual_context_properties, :quals, on_delete: :cascade, on_update: :cascade
    add_foreign_key :qual_context_properties, :contexts, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :qual_country_properties, :quals
    remove_foreign_key :qual_country_properties, :countries
    add_foreign_key :qual_country_properties, :quals, on_delete: :cascade, on_update: :cascade
    add_foreign_key :qual_country_properties, :countries, on_delete: :cascade, on_update: :cascade

    remove_foreign_key :qual_commodity_properties, :quals
    remove_foreign_key :qual_commodity_properties, :commodities
    add_foreign_key :qual_commodity_properties, :quals, on_delete: :cascade, on_update: :cascade
    add_foreign_key :qual_commodity_properties, :commodities, on_delete: :cascade, on_update: :cascade
  end
end
