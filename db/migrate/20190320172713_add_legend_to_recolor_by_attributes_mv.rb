class AddLegendToRecolorByAttributesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :recolor_by_attributes_mv,
            version: 3,
            revert_to_version: 2,
            materialized: true
  end
end
