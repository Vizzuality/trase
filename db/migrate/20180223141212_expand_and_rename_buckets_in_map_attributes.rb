class ExpandAndRenameBucketsInMapAttributes < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      rename_column :map_attributes, :bucket_3, :dual_layer_buckets
      rename_column :map_attributes, :bucket_5, :single_layer_buckets
      update_view :map_attributes_mv,
                  version: 4,
                  revert_to_version: 3,
                  materialized: true
      execute <<~SQL
        UPDATE map_attributes
        SET dual_layer_buckets = ARRAY[
          dual_layer_buckets[1],
          (dual_layer_buckets[1] + dual_layer_buckets[2]) / 2,
          dual_layer_buckets[2]
        ]
        WHERE dual_layer_buckets IS NOT NULL AND ARRAY_LENGTH(dual_layer_buckets, 1) = 2
      SQL

      execute 'REFRESH MATERIALIZED VIEW map_attributes_mv'
    end
  end

  def down
    with_search_path('revamp') do
      execute <<~SQL
        UPDATE map_attributes
        SET dual_layer_buckets = ARRAY[dual_layer_buckets[1], dual_layer_buckets[3]]
        WHERE dual_layer_buckets IS NOT NULL AND ARRAY_LENGTH(dual_layer_buckets, 1) = 3
      SQL

      rename_column :map_attributes, :dual_layer_buckets, :bucket_3
      rename_column :map_attributes, :single_layer_buckets, :bucket_5
      update_view :map_attributes_mv,
                  version: 4,
                  revert_to_version: 3,
                  materialized: true

      execute 'REFRESH MATERIALIZED VIEW map_attributes_mv'
    end
  end
end
