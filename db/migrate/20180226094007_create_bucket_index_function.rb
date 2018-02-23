class CreateBucketIndexFunction < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      execute <<~SQL
        CREATE OR REPLACE FUNCTION bucket_index(
            buckets double precision[], value double precision
        )
        RETURNS INTEGER
        LANGUAGE 'sql'
        IMMUTABLE
        AS $BODY$

        SELECT CASE WHEN value > 0 THEN idx ELSE 0 END FROM (
          SELECT COALESCE(hi.idx, lo.idx + 1)::INT AS idx, lo.val AS lo, hi.val AS hi
          FROM UNNEST(buckets) WITH ORDINALITY AS lo(val, idx)
          FULL OUTER JOIN UNNEST(buckets) WITH ORDINALITY AS hi(val, idx) ON lo.idx + 1 = hi.idx
        ) t
        WHERE
          value >= t.lo AND value < t.hi AND t.lo IS NOT NULL AND t.hi IS NOT NULL
          OR value >= t.lo AND t.hi IS NULL
          OR value < t.hi AND t.lo IS NULL;
        $BODY$;

        COMMENT ON FUNCTION revamp.bucket_index(double precision[], double precision) IS
        'Given an n-element array of choropleth buckets and a positive value, returns index of bucket where value falls (1 to n + 1); else returns 0.';
      SQL
    end
  end

  def down
    with_search_path('revamp') do
      execute 'DROP FUNCTION bucket_index(double precision[], double precision)'
    end
  end
end
