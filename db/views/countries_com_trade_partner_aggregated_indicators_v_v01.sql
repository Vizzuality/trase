SELECT
  SUM(quantity)::FLOAT AS quantity,
  SUM(value)::FLOAT AS value,
  commodity_id,
  year::SMALLINT,
  iso2,
  partner_iso2,
  activity
FROM countries_com_trade_partner_indicators
GROUP BY ROLLUP(commodity_id), year, iso2, partner_iso2, activity;
