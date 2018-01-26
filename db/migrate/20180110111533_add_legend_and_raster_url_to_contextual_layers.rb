class AddLegendAndRasterUrlToContextualLayers < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      add_column :carto_layers, :raster_url, :string, null: true
      add_column :contextual_layers, :legend, :text, null: true
    end

  end
end
