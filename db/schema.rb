# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170308111306) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "intarray"

  create_table "commodities", primary_key: "commodity_id", force: :cascade do |t|
    t.text "name"
  end

  create_table "context", force: :cascade do |t|
    t.integer "country_id"
    t.integer "commodity_id"
    t.integer "years",        array: true
  end

  create_table "context_nodes", force: :cascade do |t|
    t.integer "context_id"
    t.integer "column_group"
    t.integer "column_position"
    t.boolean "is_default"
    t.integer "node_type_id"
  end

  create_table "countries", primary_key: "country_id", force: :cascade do |t|
    t.text "name"
    t.text "iso2"
  end

  create_table "flow_inds", id: false, force: :cascade do |t|
    t.integer "flow_id"
    t.integer "ind_id"
    t.float   "value"
  end

  create_table "flow_quals", id: false, force: :cascade do |t|
    t.integer "flow_id"
    t.integer "qual_id"
    t.text    "value"
  end

  create_table "flow_quants", id: false, force: :cascade do |t|
    t.integer "flow_id"
    t.integer "quant_id"
    t.float   "value"
  end

  create_table "flows", primary_key: "flow_id", force: :cascade do |t|
    t.integer "year",       limit: 2
    t.integer "path",                 array: true
    t.integer "context_id"
  end

  create_table "inds", primary_key: "ind_id", force: :cascade do |t|
    t.text    "name"
    t.text    "unit"
    t.text    "unit_type"
    t.boolean "tooltip"
    t.boolean "place_factsheet"
    t.boolean "actor_factsheet"
    t.boolean "place_factsheet_tabular"
    t.boolean "actor_factsheet_tabular"
    t.boolean "place_factsheet_temporal"
    t.boolean "actor_factsheet_temporal"
    t.text    "frontend_name"
  end

  create_table "layer", force: :cascade do |t|
    t.integer "attribute_id"
    t.string  "attribute_type", limit: 5
    t.integer "context_id"
    t.integer "position"
    t.float   "bucket_3",                 array: true
    t.float   "bucket_5",                 array: true
    t.integer "layer_group_id"
  end

  create_table "layer_group", force: :cascade do |t|
    t.text "name"
  end

  create_table "node_inds", id: false, force: :cascade do |t|
    t.integer "node_id"
    t.integer "ind_id"
    t.integer "year",    limit: 2
    t.float   "value"
  end

  create_table "node_quals", id: false, force: :cascade do |t|
    t.integer "node_id"
    t.integer "qual_id"
    t.integer "year",    limit: 2
    t.text    "value"
  end

  create_table "node_quants", id: false, force: :cascade do |t|
    t.integer "node_id"
    t.integer "quant_id"
    t.integer "year",     limit: 2
    t.float   "value"
  end

  create_table "node_types", primary_key: "node_type_id", force: :cascade do |t|
    t.text "node_type"
  end

  create_table "nodes", primary_key: "node_id", force: :cascade do |t|
    t.text    "geo_id"
    t.integer "main_node_id"
    t.text    "name"
    t.integer "node_type_id"
  end

  create_table "quals", primary_key: "qual_id", force: :cascade do |t|
    t.text    "name"
    t.boolean "tooltip"
    t.boolean "place_factsheet"
    t.boolean "actor_factsheet"
    t.boolean "place_factsheet_tabular"
    t.boolean "actor_factsheet_tabular"
    t.boolean "place_factsheet_temporal"
    t.boolean "actor_factsheet_temporal"
    t.text    "frontend_name"
  end

  create_table "quants", primary_key: "quant_id", force: :cascade do |t|
    t.text    "name"
    t.text    "unit"
    t.text    "unit_type"
    t.boolean "tooltip"
    t.boolean "place_factsheet"
    t.boolean "actor_factsheet"
    t.boolean "place_factsheet_tabular"
    t.boolean "actor_factsheet_tabular"
    t.boolean "place_factsheet_temporal"
    t.boolean "actor_factsheet_temporal"
    t.text    "frontend_name"
  end

  add_foreign_key "context", "commodities", primary_key: "commodity_id", name: "context_commodity_id_fkey"
  add_foreign_key "context", "countries", primary_key: "country_id", name: "context_country_id_fkey"
  add_foreign_key "context_nodes", "context", name: "context_nodes_context_id_fkey"
  add_foreign_key "context_nodes", "node_types", primary_key: "node_type_id", name: "context_nodes_node_type_id_fkey"
  add_foreign_key "flow_inds", "flows", primary_key: "flow_id", name: "flow_inds_flow_id_fkey"
  add_foreign_key "flow_inds", "inds", primary_key: "ind_id", name: "flow_inds_ind_id_fkey"
  add_foreign_key "flow_quals", "flows", primary_key: "flow_id", name: "flow_quals_flow_id_fkey"
  add_foreign_key "flow_quals", "quals", primary_key: "qual_id", name: "flow_quals_qual_id_fkey"
  add_foreign_key "flow_quants", "flows", primary_key: "flow_id", name: "flow_quants_flow_id_fkey"
  add_foreign_key "flow_quants", "quants", primary_key: "quant_id", name: "flow_quants_quant_id_fkey"
  add_foreign_key "flows", "context", name: "flows_context_id_fkey"
  add_foreign_key "layer", "context", name: "layer_context_id_fkey"
  add_foreign_key "node_inds", "inds", primary_key: "ind_id", name: "node_inds_ind_id_fkey"
  add_foreign_key "node_inds", "nodes", primary_key: "node_id", name: "node_inds_node_id_fkey"
  add_foreign_key "node_quals", "nodes", primary_key: "node_id", name: "node_quals_node_id_fkey"
  add_foreign_key "node_quals", "quals", primary_key: "qual_id", name: "node_quals_qual_id_fkey"
  add_foreign_key "node_quants", "nodes", primary_key: "node_id", name: "node_quants_node_id_fkey"
  add_foreign_key "node_quants", "quants", primary_key: "quant_id", name: "node_quants_quant_id_fkey"
  add_foreign_key "nodes", "node_types", primary_key: "node_type_id", name: "nodes_node_type_id_fkey"

  create_view :materialized_flows, materialized: true,  sql_definition: <<-SQL
      WITH normalized_flows AS (
           SELECT f_1.flow_id,
              f_1.year,
              f_1.node_id,
              f_1."position",
              f_1.context_id,
              cn.node_type_id,
              cn.node_type
             FROM (( SELECT flows.flow_id,
                      flows.year,
                      a.node_id,
                      a."position",
                      flows.context_id
                     FROM flows,
                      LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")) f_1
               JOIN ( SELECT context_nodes.context_id,
                      context_nodes.column_position,
                      context_nodes.node_type_id,
                      node_types.node_type
                     FROM (context_nodes
                       JOIN node_types ON ((node_types.node_type_id = context_nodes.node_type_id)))) cn ON (((f_1."position" = (cn.column_position + 1)) AND (f_1.context_id = cn.context_id))))
          )
   SELECT f.flow_id,
      f.context_id,
      f.year,
      f.node_id,
      f.node_type,
          CASE
              WHEN (f.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text])) THEN upper(n.name)
              ELSE initcap(n.name)
          END AS node,
      n.geo_id,
      f_ex.node_id AS exporter_node_id,
      n_ex.name AS exporter_node,
      f_im.node_id AS importer_node_id,
      n_im.name AS importer_node,
      f_ctry.node_id AS country_node_id,
      n_ctry.name AS country_node,
      q.quant_id,
      (((q.name || ' ('::text) || q.unit) || ')'::text) AS name,
      fq.value
     FROM (((((((((normalized_flows f
       JOIN nodes n ON ((n.node_id = f.node_id)))
       JOIN normalized_flows f_ex ON (((f.flow_id = f_ex.flow_id) AND (f_ex.node_type = 'EXPORTER'::text))))
       JOIN nodes n_ex ON ((f_ex.node_id = n_ex.node_id)))
       JOIN normalized_flows f_im ON (((f.flow_id = f_im.flow_id) AND (f_im.node_type = 'IMPORTER'::text))))
       JOIN nodes n_im ON ((n_im.node_id = f_im.node_id)))
       JOIN normalized_flows f_ctry ON (((f.flow_id = f_ctry.flow_id) AND (f_ctry.node_type = 'COUNTRY'::text))))
       JOIN nodes n_ctry ON ((n_ctry.node_id = f_ctry.node_id)))
       JOIN flow_quants fq ON ((f.flow_id = fq.flow_id)))
       JOIN quants q ON ((fq.quant_id = q.quant_id)))
    WHERE (f.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text, 'MUNICIPALITY'::text]))
    ORDER BY
          CASE
              WHEN (f.node_type = 'STATE'::text) THEN 1
              WHEN (f.node_type = 'BIOME'::text) THEN 2
              ELSE 3
          END, n_ex.name, n_im.name, n_ctry.name;
  SQL

  add_index "materialized_flows", ["country_node_id"], name: "index_materialized_flows_on_country_node_id", using: :btree
  add_index "materialized_flows", ["exporter_node_id"], name: "index_materialized_flows_on_exporter_node_id", using: :btree
  add_index "materialized_flows", ["importer_node_id"], name: "index_materialized_flows_on_importer_node_id", using: :btree
  add_index "materialized_flows", ["node_id"], name: "index_materialized_flows_on_node_id", using: :btree
  add_index "materialized_flows", ["quant_id"], name: "index_materialized_flows_on_quant_id", using: :btree

end
