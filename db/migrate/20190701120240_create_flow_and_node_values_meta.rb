class CreateFlowAndNodeValuesMeta < ActiveRecord::Migration[5.2]
# flow_values
# {
#   commodity: {commodity_id: {years: []}},
#   country: {country_id: {years: []}},
#   context: {context_id: {years: []}}
# }

# node_values
# {
#   commodity: {commodity_id: {years: [], node_types_ids: []}},
#   country: {country_id: {years: [], node_types_ids: []}},
#   context: {context_id: {years: [], node_types_ids: []}}
# }

  def change
    create_view :quant_values_meta_mv, version: 1, materialized: true
    add_index :quant_values_meta_mv, :quant_id, unique: true, name: :quant_values_meta_mv_quant_id_idx
    create_view :ind_values_meta_mv, version: 1, materialized: true
    add_index :ind_values_meta_mv, :ind_id, unique: true, name: :ind_values_meta_mv_ind_id_idx
    create_view :qual_values_meta_mv, version: 1, materialized: true
    add_index :qual_values_meta_mv, :qual_id, unique: true, name: :qual_values_meta_mv_qual_id_idx
  end
end
