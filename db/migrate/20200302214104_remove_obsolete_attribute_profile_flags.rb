class RemoveObsoleteAttributeProfileFlags < ActiveRecord::Migration[5.2]
  def up
    columns = [
      :is_visible_on_place_profile,
      :is_visible_on_actor_profile,
      :is_temporal_on_place_profile,
      :is_temporal_on_actor_profile
    ]
    [:ind_properties, :qual_properties, :quant_properties].each do |table|
      columns.each do |column|
        remove_column table, column
      end
    end
  end
end
