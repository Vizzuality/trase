class AddContextLayerColorScale < ActiveRecord::Migration[5.0]
  def change
    add_column :context_layer, :color_scale, :string
  end
end
