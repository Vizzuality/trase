class AddUniqueIndexesOnMaterializedViews < ActiveRecord::Migration[5.2]
  def change
    remove_index :context_attribute_properties_mv, [:id, :context_id, :qual_id]
    remove_index :context_attribute_properties_mv, [:id, :context_id, :quant_id]
    remove_index :context_attribute_properties_mv, [:id, :context_id, :ind_id]

    add_index :context_attribute_properties_mv, [:context_id, :qual_id, :quant_id, :ind_id], unique: true,
      name: 'index_context_attribute_properties_mv_id'
    
    remove_index :country_attribute_properties_mv, [:id, :country_id, :qual_id]
    remove_index :country_attribute_properties_mv, [:id, :country_id, :quant_id]
    remove_index :country_attribute_properties_mv, [:id, :country_id, :ind_id]

    add_index :country_attribute_properties_mv, [:id, :country_id, :qual_id, :quant_id, :ind_id], unique: true,
      name: 'index_country_attribute_properties_mv_id'
    
    remove_index :commodity_attribute_properties_mv, [:id, :commodity_id, :qual_id]
    remove_index :commodity_attribute_properties_mv, [:id, :commodity_id, :quant_id]
    remove_index :commodity_attribute_properties_mv, [:id, :commodity_id, :ind_id]
    
    add_index :commodity_attribute_properties_mv, [:id, :commodity_id, :qual_id, :quant_id, :ind_id], unique: true,
      name: 'index_commodity_attribute_properties_mv_id'
  end
end
