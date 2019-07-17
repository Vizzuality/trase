class ApplyConsistentIndexNames < ActiveRecord::Migration[5.2]
  def change
    indexes_to_rename = [
      {
        table: :contexts,
        columns: :commodity_id,
        old_name: :index_contexts_on_commodity_id,
        new_name: :contexts_commodity_id_idx
      },
      {
        table: :context_properties,
        columns: :context_id,
        old_name: :index_context_properties_on_context_id,
        new_name: :context_properties_context_id_idx
      },
      {
        table: :context_node_types,
        columns: :context_id,
        old_name: :index_context_node_types_on_context_id,
        new_name: :context_node_types_context_id_idx
      },
      {
        table: :context_node_types,
        columns: :node_type_id,
        old_name: :index_context_node_types_on_node_type_id,
        new_name: :context_node_types_node_type_id_idx
      },
      {
        table: :context_node_type_properties,
        columns: :context_node_type_id,
        old_name: :index_context_node_type_properties_on_context_node_type_id,
        new_name: :context_node_type_properties_context_node_type_id_idx
      },
      {
        table: :quant_properties,
        columns: :quant_id,
        old_name: :index_quant_properties_on_quant_id,
        new_name: :quant_properties_quant_id_idx
      },
      {
        table: :node_properties,
        columns: :node_id,
        old_name: :index_node_properties_on_node_id,
        new_name: :node_properties_node_id_idx
      },

      {
        table: :flow_inds,
        columns: :ind_id,
        old_name: :index_flow_inds_on_flow_id,
        new_name: :flow_inds_flow_id_idx
      },
      {
        table: :flow_quals,
        columns: :qual_id,
        old_name: :index_flow_quals_on_flow_id,
        new_name: :flow_quals_flow_id_idx
      },
      {
        table: :flow_quants,
        columns: :quant_id,
        old_name: :index_flow_quants_on_flow_id,
        new_name: :flow_quants_flow_id_idx
      },
      {
        table: :download_versions,
        columns: [:context_id, :is_current],
        old_name: :index_download_versions_on_context_id_and_is_current,
        new_name: :download_versions_context_id_is_current_idx
      },
      {
        table: :flows,
        columns: :context_id,
        old_name: :index_flows_on_context_id,
        new_name: :flows_context_id_idx
      },
      {
        table: :flows,
        columns: [:context_id, :year],
        old_name: :index_flows_on_context_id_and_year,
        new_name: :flows_context_id_year_idx
      },
      {
        table: :node_inds,
        columns: :node_id,
        old_name: :index_node_inds_on_node_id,
        new_name: :node_inds_node_id_idx
      },
      {
        table: :node_quals,
        columns: :node_id,
        old_name: :index_node_quals_on_node_id,
        new_name: :node_quals_node_id_idx
      },
      {
        table: :node_quants,
        columns: :node_id,
        old_name: :index_node_quants_on_node_id,
        new_name: :node_quants_node_id_idx
      },
      {
        table: :flow_inds,
        columns: :flow_id,
        old_name: :index_flow_inds_on_flow_id,
        new_name: :flow_inds_flow_id_idx
      },
      {
        table: :flow_quals,
        columns: :flow_id,
        old_name: :index_flow_quals_on_flow_id,
        new_name: :flow_quals_flow_id_idx
      },
      {
        table: :flow_quants,
        columns: :flow_id,
        old_name: :index_flow_quants_on_flow_id,
        new_name: :flow_quants_flow_id_idx
      },
      {
        table: :map_quants,
        columns: :map_attribute_id,
        old_name: :index_map_quants_on_map_attribute_id,
        new_name: :map_quants_map_attribute_id_idx
      },
      {
        table: :map_quants,
        columns: :quant_id,
        old_name: :index_map_quants_on_quant_id,
        new_name: :map_quants_quant_id_idx
      },
      {
        table: :recolor_by_attributes,
        columns: :context_id,
        old_name: :index_recolor_by_attributes_on_context_id,
        new_name: :recolor_by_attributes_context_id_idx
      },
      {
        table: :resize_by_attributes,
        columns: :context_id,
        old_name: :index_resize_by_attributes_on_context_id,
        new_name: :resize_by_attributes_context_id_idx
      },
      {
        table: :resize_by_quants,
        columns: :resize_by_attribute_id,
        old_name: :index_resize_by_quants_on_resize_by_attribute_id,
        new_name: :resize_by_quants_resize_by_attribute_id_idx
      },
      {
        table: :resize_by_quants,
        columns: :quant_id,
        old_name: :index_resize_by_quants_on_quant_id,
        new_name: :resize_by_quants_quant_id_idx
      },
      {
        table: :download_quants,
        columns: :quant_id,
        old_name: :index_download_quants_on_quant_id,
        new_name: :download_quants_quant_id_idx
      },
      {
        table: :download_quants,
        columns: :download_attribute_id,
        old_name: :index_download_quants_on_download_attribute_id,
        new_name: :download_quants_download_attribute_id_idx
      },
      {
        table: :contextual_layers,
        columns: :context_id,
        old_name: :index_contextual_layers_on_context_id,
        new_name: :contextual_layers_context_id_idx
      },
      {
        table: :charts,
        columns: :parent_id,
        old_name: :index_charts_on_parent_id,
        new_name: :charts_parent_id_idx
      },
      {
        table: :chart_attributes,
        columns: :chart_id,
        old_name: :index_chart_attributes_on_chart_id,
        new_name: :chart_attributes_chart_id_idx
      },
      {
        table: :chart_attributes,
        columns: [:chart_id, :position],
        old_name: :chart_attributes_chart_id_position_key,
        new_name: :chart_attributes_chart_id_position_idx
      },
      {
        table: :chart_quals,
        columns: :chart_attribute_id,
        old_name: :index_chart_quals_on_chart_attribute_id,
        new_name: :chart_quals_chart_attribute_id_idx
      },
      {
        table: :chart_quals,
        columns: :qual_id,
        old_name: :index_chart_quals_on_qual_id,
        new_name: :chart_quals_qual_id_idx
      },
      {
        table: :chart_quants,
        columns: :chart_attribute_id,
        old_name: :index_chart_quants_on_chart_attribute_id,
        new_name: :chart_quants_chart_attribute_id_idx
      },
      {
        table: :chart_quants,
        columns: :quant_id,
        old_name: :index_chart_quants_on_quant_id,
        new_name: :chart_quants_quant_id_idx
      },
      {
        table: :database_updates,
        columns: :status,
        old_name: :index_database_updates_on_status,
        new_name: :database_updates_status_idx
      },
      {
        table: 'content.users',
        columns: :reset_password_token,
        old_name: 'content.index_users_on_reset_password_token',
        new_name: 'content.users_reset_password_token_idx'
      },
      {
        table: 'content.users',
        columns: :email,
        old_name: 'content.index_users_on_email',
        new_name: 'content.users_email_idx'
      },
      {
        table: :ind_commodity_properties,
        columns: :commodity_id,
        old_name: :index_ind_commodity_properties_on_commodity_id,
        new_name: :ind_commodity_properties_commodity_id_idx
      },
      {
        table: :qual_commodity_properties,
        columns: :commodity_id,
        old_name: :index_qual_commodity_properties_on_commodity_id,
        new_name: :qual_commodity_properties_commodity_id_idx
      },
      {
        table: :quant_commodity_properties,
        columns: :commodity_id,
        old_name: :index_quant_commodity_properties_on_commodity_id,
        new_name: :quant_commodity_properties_commodity_id_idx
      },
      {
        table: :ind_commodity_properties,
        columns: :ind_id,
        old_name: :index_ind_commodity_properties_on_ind_id,
        new_name: :ind_commodity_properties_ind_id_idx
      },
      {
        table: :qual_commodity_properties,
        columns: :qual_id,
        old_name: :index_qual_commodity_properties_on_qual_id,
        new_name: :qual_commodity_properties_qual_id_idx
      },
      {
        table: :quant_commodity_properties,
        columns: :quant_id,
        old_name: :index_quant_commodity_properties_on_quant_id,
        new_name: :quant_commodity_properties_quant_id_idx
      },
      {
        table: :ind_country_properties,
        columns: :country_id,
        old_name: :index_ind_country_properties_on_country_id,
        new_name: :ind_country_properties_country_id_idx
      },
      {
        table: :qual_country_properties,
        columns: :country_id,
        old_name: :index_qual_country_properties_on_country_id,
        new_name: :qual_country_properties_country_id_idx
      },
      {
        table: :quant_country_properties,
        columns: :country_id,
        old_name: :index_quant_country_properties_on_country_id,
        new_name: :quant_country_properties_country_id_idx
      },
      {
        table: :ind_country_properties,
        columns: :ind_id,
        old_name: :index_ind_country_properties_on_ind_id,
        new_name: :ind_country_properties_ind_id_idx
      },
      {
        table: :qual_country_properties,
        columns: :qual_id,
        old_name: :index_qual_country_properties_on_qual_id,
        new_name: :qual_country_properties_qual_id_idx
      },
      {
        table: :quant_country_properties,
        columns: :quant_id,
        old_name: :index_quant_country_properties_on_quant_id,
        new_name: :quant_country_properties_quant_id_idx
      },
      {
        table: :ind_context_properties,
        columns: :context_id,
        old_name: :index_ind_context_properties_on_context_id,
        new_name: :ind_context_properties_context_id_idx
      },
      {
        table: :qual_context_properties,
        columns: :context_id,
        old_name: :index_qual_context_properties_on_context_id,
        new_name: :qual_context_properties_context_id_idx
      },
      {
        table: :quant_context_properties,
        columns: :context_id,
        old_name: :index_quant_context_properties_on_context_id,
        new_name: :quant_context_properties_context_id_idx
      },
      {
        table: :ind_context_properties,
        columns: :ind_id,
        old_name: :index_ind_context_properties_on_ind_id,
        new_name: :ind_context_properties_ind_id_idx
      },
      {
        table: :qual_context_properties,
        columns: :qual_id,
        old_name: :index_qual_context_properties_on_qual_id,
        new_name: :qual_context_properties_qual_id_idx
      },
      {
        table: :quant_context_properties,
        columns: :quant_id,
        old_name: :index_quant_context_properties_on_quant_id,
        new_name: :quant_context_properties_quant_id_idx
      },
      {
        table: :attributes_mv,
        columns: :id,
        old_name: :index_attributes_mv_id_idx,
        new_name: :attributes_mv_id_idx
      },
      {
        table: :flow_paths_mv,
        columns: [:flow_id, :column_position],
        old_name: :index_flow_paths_mv_on_flow_id_and_column_position,
        new_name: :flow_paths_mv_flow_id_column_position_idx
      },
      {
        table: :commodity_attribute_properties_mv,
        columns: [:id, :commodity_id, :qual_id, :quant_id, :ind_id],
        old_name: :index_commodity_attribute_properties_mv_id,
        new_name: :commodity_attribute_properties_mv_id_idx
      },
      {
        table: :country_attribute_properties_mv,
        columns: [:id, :country_id, :qual_id, :quant_id, :ind_id],
        old_name: :index_country_attribute_properties_mv_id,
        new_name: :country_attribute_properties_mv_idx
      },
      {
        table: :context_attribute_properties_mv,
        columns: [:context_id, :qual_id, :quant_id, :ind_id],
        old_name: :index_context_attribute_properties_mv_id,
        new_name: :context_attribute_properties_mv_id_idx
      }
    ]

    reversible do |dir|
      dir.up do
        indexes_to_rename.each do |index|
          if index_exists?(index[:table], index[:columns], name: index[:old_name])
            rename_index index[:table], index[:old_name], index[:new_name]
          end
        end
      end
    end
  end
end
