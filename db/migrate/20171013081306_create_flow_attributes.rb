class CreateFlowAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :flow_attributes do |t|
        t.references :flow, null: false, foreign_key: true, index: true
        t.references :attribute, null: false, foreign_key: true, index: true
        t.timestamps
      end

      add_index :flow_attributes, [:flow_id, :attribute_id], unique: true

      create_table :flow_attributes_double_values do |t|
        t.references :flow_attribute, null: false, foreign_key: true, index: true
        t.integer :year
        t.column :value, 'double precision', null: false
        t.timestamps
      end

      add_index :flow_attributes_double_values, [:flow_attribute_id, :year], unique: true,
        name: :index_flow_attributes_double_values_on_id_and_year

      create_table :flow_attributes_text_values do |t|
        t.references :flow_attribute, null: false, foreign_key: true, index: true
        t.integer :year
        t.text :value, null: false
        t.timestamps
      end

      add_index :flow_attributes_text_values, [:flow_attribute_id, :year], unique: true,
        name: :index_flow_attributes_text_values_on_id_and_year
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :flow_attributes_double_values
      drop_table :flow_attributes_text_values
      drop_table :flow_attributes
    end
  end
end
