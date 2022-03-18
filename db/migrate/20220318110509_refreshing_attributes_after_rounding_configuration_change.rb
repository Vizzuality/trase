class RefreshingAttributesAfterRoundingConfigurationChange < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute new_upsert
        Api::V3::Readonly::Attribute.refresh
      end

      dir.down do |dir|
        execute old_upsert
      end
    end
  end

  def old_upsert
    <<~SQL
      CREATE OR REPLACE FUNCTION public.upsert_attributes() RETURNS void
          LANGUAGE sql
          AS $$

      INSERT INTO attributes (
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      )
      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      FROM attributes_v

      EXCEPT

      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      FROM attributes
      ON CONFLICT (name, original_type) DO UPDATE SET
        original_id = excluded.original_id,
        display_name = excluded.display_name,
        unit = excluded.unit,
        unit_type = excluded.unit_type,
        aggregation_method = excluded.aggregation_method,
        tooltip_text = excluded.tooltip_text,
        tooltip_text_by_context_id = excluded.tooltip_text_by_context_id,
        tooltip_text_by_commodity_id = excluded.tooltip_text_by_commodity_id,
        tooltip_text_by_country_id = excluded.tooltip_text_by_country_id,
        display_name_by_context_id = excluded.display_name_by_context_id,
        display_name_by_commodity_id = excluded.display_name_by_commodity_id,
        display_name_by_country_id = excluded.display_name_by_country_id;

      DELETE FROM attributes
      USING (
        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          aggregation_method,
          power_of_ten_for_rounding,
          tooltip_text,
          tooltip_text_by_context_id,
          tooltip_text_by_commodity_id,
          tooltip_text_by_country_id,
          display_name_by_context_id,
          display_name_by_commodity_id,
          display_name_by_country_id
        FROM attributes

        EXCEPT

        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          aggregation_method,
          power_of_ten_for_rounding,
          tooltip_text,
          tooltip_text_by_context_id,
          tooltip_text_by_commodity_id,
          tooltip_text_by_country_id,
          display_name_by_context_id,
          display_name_by_commodity_id,
          display_name_by_country_id
        FROM attributes_v
      ) s
      WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
      $$;

      COMMENT ON FUNCTION public.upsert_attributes() IS 'Upserts attributes based on new values as returned by attributes_v (identity by original_type + name)';
    SQL
  end

  def new_upsert
    <<~SQL
      CREATE OR REPLACE FUNCTION public.upsert_attributes() RETURNS void
          LANGUAGE sql
          AS $$

      INSERT INTO attributes (
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      )
      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      FROM attributes_v

      EXCEPT

      SELECT
        original_id,
        original_type,
        name,
        display_name,
        unit,
        unit_type,
        aggregation_method,
        power_of_ten_for_rounding,
        tooltip_text,
        tooltip_text_by_context_id,
        tooltip_text_by_commodity_id,
        tooltip_text_by_country_id,
        display_name_by_context_id,
        display_name_by_commodity_id,
        display_name_by_country_id
      FROM attributes
      ON CONFLICT (name, original_type) DO UPDATE SET
        original_id = excluded.original_id,
        display_name = excluded.display_name,
        unit = excluded.unit,
        unit_type = excluded.unit_type,
        aggregation_method = excluded.aggregation_method,
        power_of_ten_for_rounding = excluded.power_of_ten_for_rounding,
        tooltip_text = excluded.tooltip_text,
        tooltip_text_by_context_id = excluded.tooltip_text_by_context_id,
        tooltip_text_by_commodity_id = excluded.tooltip_text_by_commodity_id,
        tooltip_text_by_country_id = excluded.tooltip_text_by_country_id,
        display_name_by_context_id = excluded.display_name_by_context_id,
        display_name_by_commodity_id = excluded.display_name_by_commodity_id,
        display_name_by_country_id = excluded.display_name_by_country_id;

      DELETE FROM attributes
      USING (
        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          aggregation_method,
          power_of_ten_for_rounding,
          tooltip_text,
          tooltip_text_by_context_id,
          tooltip_text_by_commodity_id,
          tooltip_text_by_country_id,
          display_name_by_context_id,
          display_name_by_commodity_id,
          display_name_by_country_id
        FROM attributes

        EXCEPT

        SELECT
          original_id,
          original_type,
          name,
          display_name,
          unit,
          unit_type,
          aggregation_method,
          power_of_ten_for_rounding,
          tooltip_text,
          tooltip_text_by_context_id,
          tooltip_text_by_commodity_id,
          tooltip_text_by_country_id,
          display_name_by_context_id,
          display_name_by_commodity_id,
          display_name_by_country_id
        FROM attributes_v
      ) s
      WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
      $$;

      COMMENT ON FUNCTION public.upsert_attributes() IS 'Upserts attributes based on new values as returned by attributes_v (identity by original_type + name)';
    SQL
  end
end
