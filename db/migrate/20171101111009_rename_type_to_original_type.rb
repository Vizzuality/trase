class RenameTypeToOriginalType < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      drop_dependent_views

      update_view :attributes_mv,
        version: 2,
        revert_to_version: 1,
        materialized: true

      create_dependent_mviews(2)
    end
  end

  def down
    with_search_path('revamp') do
      drop_dependent_views

      update_view :attributes_mv,
        version: 1,
        revert_to_version: 1,
        materialized: true

      create_dependent_mviews(1)
    end
  end

  def drop_dependent_views
    drop_view :download_attributes_mv, materialized: true
    drop_view :map_attributes_mv, materialized: true
    drop_view :resize_by_attributes_mv, materialized: true
    drop_view :recolor_by_attributes_mv, materialized: true
  end

  def create_dependent_mviews(version)
      create_view :download_attributes_mv,
        version: version,
        materialized: true
      add_index :download_attributes_mv, :id, unique: true,
        name: 'download_attributes_mv_id_idx'
      add_index :download_attributes_mv, [:context_id, :attribute_id],
        name: 'download_attributes_mv_context_id_attribute_id_idx'
      create_view :resize_by_attributes_mv,
        version: version,
        materialized: true
      add_index :resize_by_attributes_mv, :id, unique: true,
        name: 'resize_by_attributes_mv_id_idx'
      add_index :resize_by_attributes_mv, [:context_id, :attribute_id],
        name: 'resize_by_attributes_mv_context_id_attribute_id_idx'
      create_view :recolor_by_attributes_mv,
        version: version,
        materialized: true
      add_index :recolor_by_attributes_mv, :id, unique: true,
        name: 'recolor_by_attributes_mv_id_idx'
      add_index :recolor_by_attributes_mv, [:context_id, :attribute_id],
        name: 'recolor_by_attributes_mv_context_id_attribute_id'
      create_view :map_attributes_mv,
        version: version,
        materialized: true
      add_index :map_attributes_mv, :id, unique: true,
        name: 'map_attributes_mv_id_idx'
      add_index :map_attributes_mv, [:map_attribute_group_id, :attribute_id],
        name: 'map_attributes_mv_map_attribute_group_id_attribute_id_idx'
  end
end
