class ExpandAndRenameBucketsInMapAttributes < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      rename_column :map_attributes, :bucket_3, :dual_layer_buckets
      rename_column :map_attributes, :bucket_5, :single_layer_buckets
      update_view :map_attributes_mv,
                  version: 4,
                  revert_to_version: 3,
                  materialized: true
    end

    Api::V3::MapAttribute.skip_callback(:commit, :after, :refresh_dependencies)

    Api::V3::MapAttribute.all.each do |ma|
      old_buckets = ma.dual_layer_buckets
      if old_buckets.present? && old_buckets.size == 2
        new_buckets = [
          old_buckets[0],
          (old_buckets[0] + old_buckets[1]) / 2, # adds value in the middle
          old_buckets[1]
        ]
        ma.update_attribute(:dual_layer_buckets, new_buckets)
      end
    end

    Api::V3::MapAttribute.set_callback(:commit, :after, :refresh_dependencies)

    Api::V3::Readonly::MapAttribute.refresh
  end

  def down
    with_search_path('revamp') do
      rename_column :map_attributes, :dual_layer_buckets, :bucket_3
      rename_column :map_attributes, :single_layer_buckets, :bucket_5
      update_view :map_attributes_mv,
                  version: 4,
                  revert_to_version: 3,
                  materialized: true
    end

    Api::V3::MapAttribute.skip_callback(:commit, :after, :refresh_dependencies)

    Api::V3::MapAttribute.all.each do |ma|
      old_buckets = ma.dual_layer_buckets
      if old_buckets.present? && old_buckets.size == 3
        new_buckets = [
          old_buckets[0], old_buckets[2]
        ]
        ma.update_attribute(:dual_layer_buckets, new_buckets)
      end
    end

    Api::V3::MapAttribute.set_callback(:commit, :after, :refresh_dependencies)

    Api::V3::Readonly::MapAttribute.refresh
  end
end
