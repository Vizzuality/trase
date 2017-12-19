class UpdateMapAttributesMvToVersion4 < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      update_view :map_attributes_mv,
                  version: 4,
                  revert_to_version: 3,
                  materialized: true

      add_index :map_attributes_mv, [:original_attribute_id, :attribute_type],
        name: 'map_attributes_mv_original_attribute_id_attribute_type_idx'

      add_index :map_attributes_mv, [:context_id]
    end
  end
end
