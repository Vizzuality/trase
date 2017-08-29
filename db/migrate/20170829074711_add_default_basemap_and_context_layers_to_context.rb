class AddDefaultBasemapAndContextLayersToContext < ActiveRecord::Migration[5.0]
  def change
    add_column :context, :default_context_layers, :string, array: true
    add_column :context, :default_basemap, :string
  end
end
