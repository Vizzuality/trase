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

ActiveRecord::Schema.define(version: 20170217085928) do

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
end
