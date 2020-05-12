SELECT
  ra.id,
  a.id AS attribute_id,
  ra.context_id,
  ra.group_number::SMALLINT,
  ra.position::SMALLINT,
  ra.interval_count::SMALLINT,
  ra.divisor,
  ra.is_disabled,
  ra.is_default,
  ra.years::SMALLINT[],
  ra.min_value,
  ra.max_value,
  ra.legend_type,
  ra.legend_color_theme,
  ra.tooltip_text,
  ARRAY[]::TEXT[] AS legend
FROM recolor_by_inds rai
JOIN recolor_by_attributes ra ON ra.id = rai.recolor_by_attribute_id
JOIN attributes a ON a.original_id = rai.ind_id AND a.original_type = 'Ind'

UNION ALL

SELECT
  ra.id,
  a.id,
  ra.context_id,
  ra.group_number::SMALLINT,
  ra.position::SMALLINT,
  ra.interval_count::SMALLINT,
  ra.divisor,
  ra.is_disabled,
  ra.is_default,
  ra.years::SMALLINT[],
  ra.min_value,
  ra.max_value,
  ra.legend_type,
  ra.legend_color_theme,
  ra.tooltip_text,
  fq.distinct_values
FROM recolor_by_quals raq
JOIN recolor_by_attributes ra ON ra.id = raq.recolor_by_attribute_id
JOIN attributes a ON a.original_id = raq.qual_id AND a.original_type = 'Qual'
JOIN flow_qual_distinct_values_mv fq ON fq.context_id = ra.context_id
  AND fq.qual_id = raq.qual_id
--JOIN (
--  SELECT flow_quals.qual_id, flows.context_id, ARRAY_AGG(DISTINCT flow_quals.value ORDER BY flow_quals.value) AS legend
--  FROM flow_quals
--  JOIN flows ON flow_quals.flow_id = flows.id
--  WHERE value NOT LIKE 'UNKNOWN%'
--  GROUP BY flow_quals.qual_id, flows.context_id
--) flow_qual_values ON flow_qual_values.context_id = ra.context_id
--  AND flow_qual_values.qual_id = raq.qual_id
GROUP BY ra.id, a.id, fq.distinct_values
