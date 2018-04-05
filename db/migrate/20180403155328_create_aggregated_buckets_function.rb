class CreateAggregatedBucketsFunction < ActiveRecord::Migration[5.1]
  def up
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

  def down
    execute 'DROP FUNCTION aggregated_buckets(double precision[], integer[], integer[], text)'
  end
end
