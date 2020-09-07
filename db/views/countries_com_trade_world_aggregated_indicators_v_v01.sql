SELECT
  SUM(quantity)::FLOAT AS quantity,
  SUM(value)::FLOAT AS value,
  RANK() OVER (PARTITION BY year, commodity_id, activity ORDER BY SUM(quantity) DESC) AS quantity_rank,
  RANK() OVER (PARTITION BY year, commodity_id, activity ORDER BY SUM(value) DESC) AS value_rank,
  commodity_id,
  year::SMALLINT,
  iso2,
  activity
FROM countries_com_trade_world_indicators
GROUP BY ROLLUP(commodity_id), year, iso2, activity;
