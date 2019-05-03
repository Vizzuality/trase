class RemoveUnusedIndexes < ActiveRecord::Migration[5.2]
  def change
    unused_indexes = [
      {
        table: 'content.staff_members',
        columns: :staff_group_id,
        name: :index_staff_members_on_staff_group_id
      },
      {
        table: :carto_layers,
        columns: :contextual_layer_id,
        name: :index_carto_layers_on_contextual_layer_id
      },
      {
        table: :chart_attributes_mv,
        columns: :chart_id,
        name: :chart_attributes_mv_chart_id_idx
      },
      {
        table: :chart_inds,
        columns: :chart_attribute_id,
        name: :index_chart_inds_on_chart_attribute_id
      },
      {
        table: :chart_inds,
        columns: :ind_id,
        name: :index_chart_inds_on_ind_id
      },
      {
        table: :charts,
        columns: :profile_id,
        name: :index_charts_on_profile_id
      },
      {
        table: :contexts,
        columns: :country_id,
        name: :index_contexts_on_country_id
      },
      {
        table: :country_properties,
        columns: :country_id,
        name: :index_country_properties_on_country_id
      },
      {
        table: :dashboards_attributes,
        columns: :dashboards_attribute_group_id,
        name: :index_dashboards_attributes_on_dashboards_attribute_group_id
      },
      {
        table: :dashboards_attributes_mv,
        columns: [:dashboards_attribute_group_id, :attribute_id],
        name: :dashboards_attributes_mv_group_id_attribute_id_idx
      },
      {
        table: :dashboards_inds,
        columns: :dashboards_attribute_id,
        name: :index_dashboards_inds_on_dashboards_attribute_id
      },
      {
        table: :dashboards_inds,
        columns: :ind_id,
        name: :index_dashboards_inds_on_ind_id
      },
      {
        table: :dashboards_quals,
        columns: :dashboards_attribute_id,
        name: :index_dashboards_quals_on_dashboards_attribute_id
      },
      {
        table: :dashboards_quals,
        columns: :qual_id,
        name: :index_dashboards_quals_on_qual_id
      },
      {
        table: :dashboards_quants,
        columns: :dashboards_attribute_id,
        name: :index_dashboards_quants_on_dashboards_attribute_id
      },
      {
        table: :dashboards_quants,
        columns: :quant_id,
        name: :index_dashboards_quants_on_quant_id
      },
      {
        table: :download_attributes,
        columns: :context_id,
        name: :index_download_attributes_on_context_id
      },
      {
        table: :download_attributes_mv,
        columns: [:context_id, :attribute_id],
        name: :download_attributes_mv_context_id_attribute_id_idx
      },
      {
        table: :download_flows_mv,
        columns: :importer_node_id,
        name: :download_flows_mv_importer_node_id_idx
      },
      {
        table: :download_quals,
        columns: :download_attribute_id,
        name: :index_download_quals_on_download_attribute_id
      },
      {
        table: :download_quals,
        columns: :qual_id,
        name: :index_download_quals_on_qual_id
      },
      {
        table: :flows,
        columns: :path,
        name: :index_flows_on_path
      },
      {
        table: :ind_properties,
        columns: :ind_id,
        name: :index_ind_properties_on_ind_id
      },
      {
        table: :map_attribute_groups,
        columns: :context_id,
        name: :index_map_attribute_groups_on_context_id
      },
      {
        table: :map_attributes,
        columns: :map_attribute_group_id,
        name: :index_map_attributes_on_map_attribute_group_id
      },
      {
        table: :map_attributes_mv,
        columns: [:context_id, :is_disabled],
        name: :map_attributes_mv_context_id_is_disabled_idx
      },
      {
        table: :map_attributes_mv,
        columns: [:map_attribute_group_id, :attribute_id],
        name: :map_attributes_mv_map_attribute_group_id_attribute_id_idx
      },
      {
        table: :map_attributes_mv,
        columns: [:original_attribute_id, :attribute_type],
        name: :map_attributes_mv_original_attribute_id_attribute_type_idx
      },
      {
        table: :map_inds,
        columns: :ind_id,
        name: :index_map_inds_on_ind_id
      },
      {
        table: :map_inds,
        columns: :map_attribute_id,
        name: :index_map_inds_on_map_attribute_id
      },
      {
        table: :profiles,
        columns: :context_node_type_id,
        name: :index_profiles_on_context_node_type_id
      },
      {
        table: :qual_properties,
        columns: :qual_id,
        name: :index_qual_properties_on_qual_id
      },
      {
        table: :recolor_by_attributes_mv,
        columns: [:context_id, :attribute_id],
        name: :recolor_by_attributes_mv_context_id_attribute_id
      },
      {
        table: :recolor_by_inds,
        columns: :ind_id,
        name: :index_recolor_by_inds_on_ind_id
      },
      {
        table: :recolor_by_inds,
        columns: :recolor_by_attribute_id,
        name: :index_recolor_by_inds_on_recolor_by_attribute_id
      },
      {
        table: :recolor_by_quals,
        columns: :qual_id,
        name: :index_recolor_by_quals_on_qual_id
      },
      {
        table: :recolor_by_quals,
        columns: :recolor_by_attribute_id,
        name: :index_recolor_by_quals_on_recolor_by_attribute_id
      }
    ]

    reversible do |dir|
      dir.up do
        unused_indexes.each do |index|
          if index_exists?(index[:table], index[:columns], name: index[:name])
            remove_index index[:table], name: index[:name]
          end
        end
      end
    end
  end
end
