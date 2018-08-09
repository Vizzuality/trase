class AddTopoJsonPathsToProfile < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :adm_1_topojson_path, :string
    add_column :profiles, :adm_1_topojson_root, :string

    add_column :profiles, :adm_2_topojson_path, :string
    add_column :profiles, :adm_2_topojson_root, :string

    add_column :profiles, :main_topojson_path, :string
    add_column :profiles, :main_topojson_root, :string
  end
end
