class AddAggregationMethodToView < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        add_column :attributes, :aggregation_method, :text
        update_view :attributes_v, materialized: false, version: 4

        function =<<~SQL
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
    SQL
        execute function
        Api::V3::Readonly::Attribute.refresh

        update_view :map_attributes_v, materialized: false, version: 2
      end

      dir.down do
        update_view :map_attributes_v, materialized: false, version: 1
        update_view :attributes_v, materialized: false, version: 3
        remove_column :attributes, :aggregation_method, :text

        function =<<~SQL
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
    SQL
        execute function
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
