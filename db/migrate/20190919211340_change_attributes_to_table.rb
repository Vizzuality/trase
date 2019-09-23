class ChangeAttributesToTable < ActiveRecord::Migration[5.2]
  def change
    create_view :attributes_v,
      version: 1,
      materialized: false

    create_table :attributes do |t|
      t.integer :original_id, null: false
      t.text :original_type, null: false
      t.text :name, null: false
      t.text :display_name
      t.text :unit
      t.text :unit_type
      t.text :tooltip_text
    end

    execute "ALTER TABLE attributes ADD CONSTRAINT attributes_original_type_check CHECK (original_type IN ('Ind', 'Qual', 'Quant'))"

    add_index :attributes,
      [:original_type, :name],
      unique: true,
      name: 'attributes_original_type_name_idx'

    execute <<~SQL
      CREATE OR REPLACE FUNCTION upsert_attributes()
      RETURNS VOID
      LANGUAGE 'sql'
      VOLATILE
      AS $BODY$

      INSERT INTO attributes (
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        tooltip_text
      )
      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        tooltip_text
      FROM attributes_v

      EXCEPT

      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        tooltip_text
      FROM attributes
      ON CONFLICT (name, original_type) DO UPDATE SET
        original_id = excluded.original_id,
        display_name = excluded.display_name,
        unit = excluded.unit,
        unit_type = excluded.unit_type,
        tooltip_text = excluded.tooltip_text;

      DELETE FROM attributes
      USING (
        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          tooltip_text
        FROM attributes

        EXCEPT

        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          tooltip_text
        FROM attributes_v
      ) s
      WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
      $BODY$;

      COMMENT ON FUNCTION upsert_attributes() IS
      'Upserts attributes based on new values as returned by attributes_v (identity by original_type + name)';
    SQL

    update_view :chart_attributes_mv,
      version: 4,
      revert_to_version: 3,
      materialized: true

    update_view :dashboards_attributes_mv,
      version: 3,
      revert_to_version: 2,
      materialized: true

    update_view :download_attributes_mv,
      version: 4,
      revert_to_version: 3,
      materialized: true

    update_view :map_attributes_mv,
      version: 5,
      revert_to_version: 4,
      materialized: true

    update_view :recolor_by_attributes_mv,
      version: 4,
      revert_to_version: 3,
      materialized: true

    update_view :resize_by_attributes_mv,
      version: 3,
      revert_to_version: 2,
      materialized: true

    drop_view :attributes_mv, materialized: true
  end
end
