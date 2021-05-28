class RemoveAggregatedBucketsFunction < ActiveRecord::Migration[5.2]
  def up
    execute 'DROP FUNCTION aggregated_buckets(double precision[], integer[], integer[], text)'
    execute <<~SQL
      CREATE OR REPLACE FUNCTION aggregated_buckets(
        buckets double precision[],
        declared_years integer[],
        requested_years integer[],
        aggregation_method text
      )
      RETURNS double precision[]
      LANGUAGE 'sql'
      IMMUTABLE
      AS $BODY$
        SELECT CASE
          WHEN aggregation_method = 'SUM' AND ICOUNT(COALESCE(declared_years, requested_years) & requested_years) > 0 THEN
            ARRAY(SELECT ICOUNT(COALESCE(declared_years, requested_years) & requested_years) * UNNEST(buckets))
          ELSE
            buckets
        END
      $BODY$;

      COMMENT ON FUNCTION aggregated_buckets(double precision[], integer[], integer[], text) IS
      'Returns aggregated buckets for year range';
    SQL
  end

  def down
    execute 'DROP FUNCTION aggregated_buckets(double precision[], integer[], integer[], text)'
    execute <<~SQL
      CREATE OR REPLACE FUNCTION aggregated_buckets(
        buckets double precision[],
        declared_years integer[],
        requested_years integer[],
        attribute_type text
      )
      RETURNS double precision[]
      LANGUAGE 'sql'
      IMMUTABLE
      AS $BODY$
        SELECT CASE
          WHEN attribute_type = 'quant' AND ICOUNT(COALESCE(declared_years, requested_years) & requested_years) > 0 THEN
            ARRAY(SELECT ICOUNT(COALESCE(declared_years, requested_years) & requested_years) * UNNEST(buckets))
          ELSE
            buckets
        END
      $BODY$;

      COMMENT ON FUNCTION aggregated_buckets(double precision[], integer[], integer[], text) IS
      'Aggregates buckets.';
    SQL
  end
end
