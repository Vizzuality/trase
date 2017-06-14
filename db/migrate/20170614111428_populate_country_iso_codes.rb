class PopulateCountryIsoCodes < ActiveRecord::Migration[5.0]
  def up
    execute 'CREATE TEMP TABLE iso_codes (name TEXT, iso_code2 CHAR(2), iso_code3 CHAR(3))'
    execute "COPY iso_codes FROM '#{Rails.root}/db/iso_codes.csv' DELIMITER ',' CSV HEADER"
    update_sql = <<-SQL
WITH country_nodes AS (
SELECT nodes.node_id, nodes.name,
  CASE
    WHEN UPPER(nodes.name) = 'BOLIVIA' THEN 'BO'
    WHEN UPPER(nodes.name) = 'BRUNEI' THEN 'BN'
    WHEN UPPER(nodes.name) = 'CANARIES ISLANDS' THEN 'IC'
    WHEN UPPER(nodes.name) = 'CAPE VERDE' THEN 'CV'
    WHEN UPPER(nodes.name) = 'CHANNEL ISLANDS' THEN 'GB'
    WHEN UPPER(nodes.name) = 'CONGO DEMOCRATIC REPUBLIC OF THE' THEN 'CD'
    WHEN UPPER(nodes.name) = 'COTE D''IVOIRE' THEN 'CI'
    WHEN UPPER(nodes.name) = 'CURACAO' THEN 'CW'
    WHEN UPPER(nodes.name) = 'CZECH REPUBLIC' THEN 'CZ'
    WHEN UPPER(nodes.name) = 'DOMINICA ISLAND' THEN 'DM'
    WHEN UPPER(nodes.name) = 'FRENCH GUYANA' THEN 'GF'
    WHEN UPPER(nodes.name) = 'GAZA STRIP (PALESTINE)' THEN 'PS'
    WHEN UPPER(nodes.name) = 'IRAN' THEN 'IR'
    WHEN UPPER(nodes.name) = 'JOHNSTON (ISLAND)' THEN 'JT'
    WHEN UPPER(nodes.name) = 'KOSOVO' THEN 'XK'
    WHEN UPPER(nodes.name) = 'MACEDONIA' THEN 'MK'
    WHEN UPPER(nodes.name) = 'MICRONESIA' THEN 'FM'
    WHEN UPPER(nodes.name) = 'MOLDOVA' THEN 'MD'
    WHEN UPPER(nodes.name) = 'NETHERLANDS ANTILLES' THEN 'AN'
    WHEN UPPER(nodes.name) = 'NORTH KOREA' THEN 'KP'
    WHEN UPPER(nodes.name) = 'SOUTH KOREA' THEN 'KR'
    WHEN UPPER(nodes.name) = 'ST. KITTS AND NEVIS' THEN 'KN'
    WHEN UPPER(nodes.name) = 'ST. VICENT AND THE GRENADINES' THEN 'VC'
    WHEN UPPER(nodes.name) = 'TAIWAN' THEN 'TW'
    WHEN UPPER(nodes.name) = 'TANZANIA' THEN 'TZ'
    WHEN UPPER(nodes.name) = 'UNITED KINGDOM' THEN 'GB'
    WHEN UPPER(nodes.name) = 'UNITED STATES' THEN 'US'
    WHEN UPPER(nodes.name) = 'VENEZUELA' THEN 'VE'
    WHEN UPPER(nodes.name) = 'VIETNAM' THEN 'VN'
    WHEN UPPER(nodes.name) = 'VIRGIN ISLANDS (UK)' THEN 'VG'
    ELSE iso_codes.iso_code2
  END AS iso_code
FROM nodes
LEFT JOIN iso_codes ON UPPER(nodes.name) = UPPER(iso_codes.name)
WHERE node_type_id in (8, 13)
ORDER BY nodes.name
)
UPDATE nodes
SET geo_id = country_nodes.iso_code
FROM country_nodes
WHERE nodes.node_id = country_nodes.node_id
SQL
    execute update_sql
  end

  def down
    execute 'UPDATE nodes SET geo_id = NULL WHERE node_type_id in (8, 13)'
  end
end
