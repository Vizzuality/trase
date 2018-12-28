class CreateChartNodeTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :chart_node_types do |t|
      t.references :chart, foreign_key: true, index: false
      t.references :node_type, foreign_key: true, index: false
      t.text :identifier
      t.integer :position
      t.boolean :is_total, default: false

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
          ALTER TABLE chart_node_types
            ADD CONSTRAINT chart_node_types_chart_id_identifier_position_key
              UNIQUE (chart_id, identifier, position)
        SQL
      end
      dir.down do
        execute <<~SQL
          ALTER TABLE chart_attributes
            DROP CONSTRAINT IF EXISTS chart_node_types_chart_id_identifier_position_key
        SQL
      end
    end
  end
end
