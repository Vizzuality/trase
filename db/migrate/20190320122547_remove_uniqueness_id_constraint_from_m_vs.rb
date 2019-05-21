class RemoveUniquenessIdConstraintFromMVs < ActiveRecord::Migration[5.2]
  def change
    remove_index :context_attribute_properties_mv, :id
    add_index :context_attribute_properties_mv, [:id, :context_id, :qual_id], unique: true,
      name: 'index_context_qual_attribute_properties_mv_id'
    add_index :context_attribute_properties_mv, [:id, :context_id, :quant_id], unique: true,
      name: 'index_context_quant_attribute_properties_mv_id'
    add_index :context_attribute_properties_mv, [:id, :context_id, :ind_id], unique: true,
      name: 'index_context_ind_attribute_properties_mv_id'
    
    remove_index :country_attribute_properties_mv, :id
    add_index :country_attribute_properties_mv, [:id, :country_id, :qual_id], unique: true,
      name: 'index_country_qual_attribute_properties_mv_id'
    add_index :country_attribute_properties_mv, [:id, :country_id, :quant_id], unique: true,
      name: 'index_country_quant_attribute_properties_mv_id'
    add_index :country_attribute_properties_mv, [:id, :country_id, :ind_id], unique: true,
      name: 'index_country_ind_attribute_properties_mv_id'
    
    remove_index :commodity_attribute_properties_mv, :id
    add_index :commodity_attribute_properties_mv, [:id, :commodity_id, :qual_id], unique: true,
      name: 'index_commodity_qual_attribute_properties_mv_id'
    add_index :commodity_attribute_properties_mv, [:id, :commodity_id, :quant_id], unique: true,
      name: 'index_commodity_quant_attribute_properties_mv_id'
    add_index :commodity_attribute_properties_mv, [:id, :commodity_id, :ind_id], unique: true,
      name: 'index_commodity_ind_attribute_properties_mv_id'
  end
end
