class CreateNodeAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :node_attributes do |t|
        t.references :node, null: false, foreign_key: true, index: true
        t.references :attribute, null: false, foreign_key: true, index: true
        t.timestamps
      end

      add_index :node_attributes, [:node_id, :attribute_id], unique: true

      create_table :node_attributes_double_values do |t|
        t.references :node_attribute, null: false, foreign_key: true, index: true
        t.integer :year
        t.column :value, 'double precision', null: false
      end

      add_index :node_attributes_double_values, [:node_attribute_id, :year], unique: true,
        name: :index_node_attributes_double_values_on_id_and_year

      create_table :node_attributes_text_values do |t|
        t.references :node_attribute, null: false, foreign_key: true, index: true
        t.integer :year
        t.text :value, null: false
      end

      add_index :node_attributes_text_values, [:node_attribute_id, :year], unique: true,
        name: :index_node_attributes_text_values_on_id_and_year
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :node_attributes_double_values
      drop_table :node_attributes_text_values
      drop_table :node_attributes
    end
  end
end
