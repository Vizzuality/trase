class UpdateMaterializedMapAttributesToVersion3 < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do

      update_view :map_attributes_mv,
                  version: 3,
                  revert_to_version: 2,
                  materialized: true

    end
  end
end