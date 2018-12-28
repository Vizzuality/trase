class AddIdentifierToChartAttributes < ActiveRecord::Migration[5.2]
  def change
    add_column :chart_attributes, :identifier, :text
    update_view :chart_attributes_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true

    reversible do |dir|
      dir.up do
        execute <<~SQL
          ALTER TABLE chart_attributes
            ADD CONSTRAINT chart_attributes_chart_id_identifier_key
              UNIQUE (chart_id, identifier)
        SQL

        execute <<~SQL
          ALTER TABLE chart_attributes
            DROP CONSTRAINT IF EXISTS chart_attributes_chart_id_position_key
        SQL

        add_index :chart_attributes, [:chart_id, :position],
          where: "(identifier IS NULL)",
          name: 'chart_attributes_chart_id_position_key',
          unique: true
      end
      dir.down do
        execute <<~SQL
          ALTER TABLE chart_attributes
            DROP CONSTRAINT IF EXISTS chart_attributes_chart_id_identifier_key
        SQL

        execute <<~SQL
          DROP INDEX IF EXISTS chart_attributes_chart_id_position_key
        SQL

        execute <<~SQL
          ALTER TABLE chart_attributes
            ADD CONSTRAINT chart_attributes_chart_id_position_key
            UNIQUE (chart_id, position)
        SQL
      end
    end
  end
end
