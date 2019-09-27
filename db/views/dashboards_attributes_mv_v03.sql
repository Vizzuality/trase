SELECT da.id, da.dashboards_attribute_group_id, position, a.id AS attribute_id
FROM dashboards_inds di
JOIN dashboards_attributes da ON da.id = di.dashboards_attribute_id
JOIN attributes a ON a.original_id = di.ind_id AND a.original_type = 'Ind'

UNION ALL

SELECT da.id, da.dashboards_attribute_group_id, position, a.id AS attribute_id
FROM dashboards_quals dq
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes a ON a.original_id = dq.qual_id AND a.original_type = 'Qual'

UNION ALL

SELECT da.id, da.dashboards_attribute_group_id, position, a.id AS attribute_id
FROM dashboards_quants dq
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes a ON a.original_id = dq.quant_id AND a.original_type = 'Quant'
