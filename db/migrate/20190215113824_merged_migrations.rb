# prod: 20190215113824
# demo: 20190215113824
# sandbox: 20190321161913
# staging: 20190321161913
# dashboardsdemo: 20190321161913

class MergedMigrations < ActiveRecord::Migration[5.2]
  def change
    enable_extension 'intarray'
    enable_extension 'tablefunc'
    enable_extension 'postgres_fdw'
    enable_extension 'plpgsql'

    create_schema :main
    create_schema :content

    create_table :countries, id: :integer do |t|
      t.text :name, null: false
      t.text :iso2, null: false
      t.timestamp :created_at, null: false
    end

    create_table :country_properties, id: :integer do |t|
      t.references :country, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.column :latitude, 'double precision', null: false
      t.column :longitude, 'double precision', null: false
      t.integer :zoom, null: false
      t.timestamps
      t.float :annotation_position_x_pos
      t.float :annotation_position_y_pos
    end

    create_table :commodities, id: :integer do |t|
      t.text :name, null: false
      t.timestamp :created_at, null: false
    end

    create_table :contexts, id: :integer do |t|
      t.references :country, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.references :commodity, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.integer :years, array: true
      t.integer :default_year
      t.timestamp :created_at, null: false
    end

    create_table :download_versions, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}, index: false
      t.string :symbol, null: false
      t.boolean :is_current, null: false, default: false
      t.timestamp :created_at, null: false
    end

    add_index :download_versions, [:context_id, :is_current],
      where: '(is_current IS TRUE)',
      unique: true

    create_table :context_properties, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.text :default_basemap
      t.boolean :is_disabled, null: false, default: false
      t.boolean :is_default, null: false, default: false
      t.timestamps
      t.boolean :is_subnational, null: false, default: false
      t.boolean :is_highlighted
    end

    create_table :node_types, id: :integer do |t|
      t.text :name, null: false
      t.timestamp :created_at, null: false
    end

    create_table :context_node_types, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :node_type, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :column_position, null: false
      t.timestamp :created_at, null: false
    end

    create_table :context_node_type_properties, id: :integer do |t|
      t.references :context_node_type, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :column_group, null: false
      t.boolean :is_default, null: false, default: false
      t.boolean :is_geo_column, null: false, default: false
      t.timestamps
      t.boolean :is_choropleth_disabled, null: false, default: false
    end

    create_table :nodes, id: :integer do |t|
      t.references :node_type, type: :integer, null: false, foreign_key: {on_delete: :cascade},
        index: {name: 'nodes_node_type_id_idx'}
      t.text :name, null: false
      t.text :geo_id
      t.boolean :is_unknown, null: false, default: false
      t.timestamp :created_at, null: false
      t.integer :main_id
    end

    create_table :node_properties, id: :integer do |t|
      t.references :node, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.boolean :is_domestic_consumption, null: false, default: false
      t.timestamps
    end

    create_table :flows, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.column :year, 'smallint', null: false
      t.integer :path, array: true, default: []
      t.timestamp :created_at, null: false
    end
    add_index :flows, [:context_id, :year]
    add_index :flows, [:path]

    create_table :quants, id: :integer do |t|
      t.text :name, null: false
      t.text :unit
      t.timestamp :created_at, null: false
    end

    create_table :quant_properties, id: :integer do |t|
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.text :display_name, null: false
      t.text :unit_type
      t.text :tooltip_text
      t.boolean :is_visible_on_place_profile, null: false, default: false
      t.boolean :is_visible_on_actor_profile, null: false, default: false
      t.boolean :is_temporal_on_place_profile, null: false, default: false
      t.boolean :is_temporal_on_actor_profile, null: false, default: false
      t.timestamps
    end

    create_table :inds, id: :integer do |t|
      t.text :name, null: false
      t.text :unit
      t.timestamp :created_at, null: false
    end

    create_table :ind_properties, id: :integer do |t|
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.text :display_name, null: false
      t.text :unit_type
      t.text :tooltip_text
      t.boolean :is_visible_on_place_profile, null: false, default: false
      t.boolean :is_visible_on_actor_profile, null: false, default: false
      t.boolean :is_temporal_on_place_profile, null: false, default: false
      t.boolean :is_temporal_on_actor_profile, null: false, default: false
      t.timestamps
    end

    create_table :quals, id: :integer do |t|
      t.text :name, null: false
      t.timestamp :created_at, null: false
    end

    create_table :qual_properties, id: :integer do |t|
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.text :display_name, null: false
      t.text :tooltip_text
      t.boolean :is_visible_on_place_profile, null: false, default: false
      t.boolean :is_visible_on_actor_profile, null: false, default: false
      t.boolean :is_temporal_on_place_profile, null: false, default: false
      t.boolean :is_temporal_on_actor_profile, null: false, default: false
      t.timestamps
    end

    create_table :node_quants, id: :integer do |t|
      t.references :node, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'node_quants_quant_id_idx'}
      t.integer :year
      t.column :value, 'double precision', null: false
      t.timestamp :created_at, null: false
    end

    create_table :node_inds, id: :integer do |t|
      t.references :node, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'node_inds_ind_id_idx'}
      t.integer :year
      t.column :value, 'double precision', null: false
      t.timestamp :created_at, null: false
    end

    create_table :node_quals, id: :integer do |t|
      t.references :node, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'node_quals_qual_id_idx'}
      t.integer :year
      t.text :value, null: false
      t.timestamp :created_at, null: false
    end

    create_table :flow_quants, id: :integer do |t|
      t.references :flow, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'flow_quants_quant_id_idx'}
      t.column :value, 'double precision', null: false
      t.timestamp :created_at, null: false
    end

    create_table :flow_inds, id: :integer do |t|
      t.references :flow, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'flow_inds_ind_id_idx'}
      t.column :value, 'double precision', null: false
      t.timestamp :created_at, null: false
    end

    create_table :flow_quals, id: :integer do |t|
      t.references :flow, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade},
        index: {name: 'flow_quals_qual_id_idx'}
      t.text :value, null: false
      t.timestamp :created_at, null: false
    end

    create_table :map_attribute_groups, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.text :name, null: false
      t.integer :position, null: false
      t.timestamps
    end

    create_table :map_attributes, id: :integer do |t|
      t.references :map_attribute_group, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :position, null: false
      t.column :dual_layer_buckets, 'double precision', array: true, null: false, default: []
      t.column :single_layer_buckets, 'double precision', array: true, null: false, default: []
      t.text :color_scale
      t.integer :years, array: true
      t.boolean :is_disabled, null: false, default: false
      t.boolean :is_default, null: false, default: false
      t.timestamps
    end

    create_table :map_quants, id: :integer do |t|
      t.references :map_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :map_inds, id: :integer do |t|
      t.references :map_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :recolor_by_attributes, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :group_number, null: false, default: 1
      t.integer :position, null: false
      t.text :legend_type, null: false
      t.text :legend_color_theme, null: false
      t.integer :interval_count
      t.text :min_value
      t.text :max_value
      t.column :divisor, 'double precision'
      t.text :tooltip_text
      t.integer :years, array: true
      t.boolean :is_disabled, null: false, default: false
      t.boolean :is_default, null: false, default: false
      t.timestamps
    end

    create_table :recolor_by_inds, id: :integer do |t|
      t.references :recolor_by_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :recolor_by_quals, id: :integer do |t|
      t.references :recolor_by_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :resize_by_attributes, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :group_number, null: false, default: 1
      t.integer :position, null: false
      t.text :tooltip_text
      t.integer :years, array: true
      t.boolean :is_disabled, null: false, default: false
      t.boolean :is_default, null: false, default: false
      t.timestamps
    end

    create_table :resize_by_quants, id: :integer do |t|
      t.references :resize_by_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :download_attributes, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :position, null: false
      t.text :display_name, null: false
      t.integer :years, array: true
      t.timestamps
    end

    create_table :download_quants, id: :integer do |t|
      t.references :download_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.boolean :is_filter_enabled, null: false, default: false
      t.column :filter_bands, 'double precision', array: true
      t.timestamps
    end

    create_table :download_quals, id: :integer do |t|
      t.references :download_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.boolean :is_filter_enabled, null: false, default: false
      t.timestamps
    end

    create_table :contextual_layers, id: :integer do |t|
      t.references :context, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.text :title, null: false
      t.text :identifier, null: false
      t.integer :position, null: false
      t.text :tooltip_text
      t.boolean :is_default, null: false, default: false
      t.timestamps
      t.text :legend, null: true
    end

    create_table :carto_layers, id: :integer do |t|
      t.references :contextual_layer, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.text :identifier, null: false
      t.integer :years, array: true
      t.timestamps
      t.string :raster_url, null: true
    end

    create_table :profiles, id: :integer do |t|
      t.references :context_node_type, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.text :name
      t.timestamps
      t.string :main_topojson_path
      t.string :main_topojson_root
      t.string :adm_1_name
      t.string :adm_1_topojson_path
      t.string :adm_1_topojson_root
      t.string :adm_2_name
      t.string :adm_2_topojson_path
      t.string :adm_2_topojson_root
    end

    create_table :charts, id: :integer do |t|
      t.references :profile, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :parent, type: :integer, foreign_key: {on_delete: :cascade, to_table: :charts}, index: true
      t.text :identifier, null: false
      t.text :title, null: false
      t.integer :position, null: false
      t.timestamps
      t.string :chart_type
    end

    create_table :chart_attributes, id: :integer do |t|
      t.references :chart, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.integer :position
      t.integer :years, array: true
      t.timestamps
      t.text :display_name
      t.text :legend_name
      t.text :display_type
      t.text :display_style
      t.boolean :state_average, null: false, default: false
      t.text :identifier
    end

    add_index :chart_attributes, [:chart_id, :position],
      where: "(identifier IS NULL)",
      name: 'chart_attributes_chart_id_position_key',
      unique: true

    create_table :chart_quants, id: :integer do |t|
      t.references :chart_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :chart_inds, id: :integer do |t|
      t.references :chart_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :chart_quals, id: :integer do |t|
      t.references :chart_attribute, type: :integer, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, type: :integer, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}
      t.timestamps
    end

    create_table :chart_node_types do |t|
      t.references :chart, foreign_key: {on_delete: :cascade}, index: false
      t.references :node_type, foreign_key: {on_delete: :cascade}, index: false
      t.text :identifier
      t.integer :position
      t.boolean :is_total, default: false
      t.timestamps
    end

    create_table :dashboards_attribute_groups do |t|
      t.text :name, null: false
      t.integer :position, null: false
      t.timestamps
    end

    create_table :dashboards_attributes do |t|
      t.references :dashboards_attribute_group, null: false, foreign_key: {on_delete: :cascade}
      t.integer :position, null: false
      t.string :chart_type, null: false
      t.timestamps
    end

    create_table :dashboards_quants do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    create_table :dashboards_quals do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    create_table :dashboards_inds do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    create_table :dashboard_templates do |t|
      t.text :title, null: false
      t.text :description, null: false
      t.timestamps
      t.string :image_file_name
      t.string :image_content_type
      t.integer :image_file_size
      t.timestamp :image_updated_at
      t.string :category
    end

    create_table :dashboard_template_commodities do |t|
      t.integer :dashboard_template_id
      t.integer :commodity_id
      t.timestamps
    end

    create_table :dashboard_template_countries do |t|
      t.integer :dashboard_template_id
      t.integer :country_id
      t.timestamps
    end

    create_table :dashboard_template_companies do |t|
      t.integer :dashboard_template_id
      t.integer :node_id
      t.timestamps
    end

    create_table :dashboard_template_destinations do |t|
      t.integer :dashboard_template_id
      t.integer :node_id
      t.timestamps
    end

    create_table :dashboard_template_sources do |t|
      t.integer :dashboard_template_id
      t.integer :node_id
      t.timestamps
    end

    create_table :database_updates do |t|
      t.json :stats
      t.timestamps
      t.text :jid
      t.text :status, null: false, default: 'STARTED'
      t.text :error
    end

    add_index :database_updates, [:status],
      where: "(status = 'STARTED')",
      unique: true

    create_table :database_validation_reports do |t|
      t.json :report, null: false
      t.integer :error_count, null: false
      t.integer :warning_count, null: false

      t.timestamps
    end

    with_search_path('content') do
      create_table :ckeditor_assets, id: :integer, force: :cascade do |t|
        t.string :data_file_name, null: false
        t.string :data_content_type
        t.integer :data_file_size
        t.string :data_fingerprint
        t.integer :assetable_id
        t.string :assetable_type, limit: 30
        t.string :type, limit: 30
        t.integer :width
        t.integer :height
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
        t.index [:assetable_type, :assetable_id], name: :idx_ckeditor_assetable
        t.index [:assetable_type, :type, :assetable_id], name: :idx_ckeditor_assetable_type
      end

      create_table :posts, id: :integer, force: :cascade do |t|
        t.text :title, null: false
        t.datetime :date, null: false
        t.text :post_url, null: false
        t.integer :state, null: false, default: 0
        t.boolean :highlighted, null: false, default: false
        t.text :category, null: false
        t.text :image_file_name
        t.text :image_content_type
        t.integer :image_file_size
        t.datetime :image_updated_at
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end

      create_table :site_dives, id: :integer, force: :cascade do |t|
        t.text :title, null: false
        t.text :page_url, null: false
        t.text :description, null: false
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end

      create_table :staff_groups, force: :cascade do |t|
        t.text :name, null: false
        t.integer :position, null: false
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end

      create_table :staff_members, force: :cascade do |t|
        t.references :staff_group, null: false, foreign_key: {on_delete: :cascade, on_update: :cascade}, index: true
        t.text :name, null: false
        t.integer :position, null: false
        t.text :bio, null: false
        t.text :image_file_name
        t.text :image_content_type
        t.integer :image_file_size
        t.datetime :image_updated_at
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end

      create_table :testimonials, force: :cascade do |t|
        t.text :quote, null: false
        t.text :author_name, null: false
        t.text :author_title, null: false
        t.string :image_file_name
        t.string :image_content_type
        t.integer :image_file_size
        t.datetime :image_updated_at
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end

      create_table :users, id: :serial, force: :cascade do |t|
        t.string :email, default: "", null: false
        t.string :encrypted_password, default: "", null: false
        t.string :reset_password_token
        t.datetime :reset_password_sent_at
        t.datetime :remember_created_at
        t.integer :sign_in_count, default: 0, null: false
        t.datetime :current_sign_in_at
        t.datetime :last_sign_in_at
        t.string :current_sign_in_ip
        t.string :last_sign_in_ip
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
        t.index [:email], name: :index_users_on_email, unique: true
        t.index [:reset_password_token], name: :index_users_on_reset_password_token, unique: true
      end

      create_table :pages do |t|
        t.text :name, null: false
        t.text :content, null: false
      end
    end

    create_view :attributes_mv, version: 3, materialized: true
    add_index :attributes_mv, :id, unique: true,
      name: 'index_attributes_mv_id_idx'
    add_index :attributes_mv, :name, unique: true,
      name: 'attributes_mv_name_idx'

    create_view :map_attributes_mv, version: 4, materialized: true
    add_index :map_attributes_mv, :id, unique: true,
      name: 'map_attributes_mv_id_idx'
    add_index :map_attributes_mv, [:map_attribute_group_id, :attribute_id],
      name: 'map_attributes_mv_map_attribute_group_id_attribute_id_idx'
    add_index :map_attributes_mv, [:original_attribute_id, :attribute_type],
      name: 'map_attributes_mv_original_attribute_id_attribute_type_idx'
    add_index :map_attributes_mv, [:context_id, :is_disabled],
      where: "(is_disabled IS FALSE)",
      name: 'map_attributes_mv_context_id_is_disabled_idx'

    create_view :recolor_by_attributes_mv, version: 2, materialized: true
    add_index :recolor_by_attributes_mv, :id, unique: true,
      name: 'recolor_by_attributes_mv_id_idx'
    add_index :recolor_by_attributes_mv, [:context_id, :attribute_id],
      name: 'recolor_by_attributes_mv_context_id_attribute_id'

    create_view :resize_by_attributes_mv, version: 2, materialized: true
    add_index :resize_by_attributes_mv, :id, unique: true,
      name: 'resize_by_attributes_mv_id_idx'
    add_index :resize_by_attributes_mv, [:context_id, :attribute_id],
      name: 'resize_by_attributes_mv_context_id_attribute_id_idx'

    create_view :download_attributes_mv, version: 2, materialized: true
    add_index :download_attributes_mv, :id, unique: true,
      name: 'download_attributes_mv_id_idx'
    add_index :download_attributes_mv, [:context_id, :attribute_id],
      name: 'download_attributes_mv_context_id_attribute_id_idx'

    create_view :chart_attributes_mv, version: 2, materialized: true
    add_index :chart_attributes_mv, :id, unique: true,
      name: 'chart_attributes_mv_id_idx'
    add_index :chart_attributes_mv, [:chart_id],
      name: 'chart_attributes_mv_chart_id_idx'

    create_view :dashboards_attributes_mv, materialized: true
    add_index :dashboards_attributes_mv, :id, unique: true,
      name: 'dashboards_attributes_mv_id_idx'
    add_index :dashboards_attributes_mv, [:dashboards_attribute_group_id, :attribute_id],
      name: 'dashboards_attributes_mv_group_id_attribute_id_idx'

    create_view :flow_paths_mv, version: 2, materialized: true
    add_index :flow_paths_mv, [:flow_id, :column_position]

    create_view :download_flows_mv, version: 4, materialized: true
    add_index :download_flows_mv, :context_id,
      name: 'download_flows_mv_context_id_idx'
    add_index :download_flows_mv, :exporter_node_id,
      name: 'download_flows_mv_exporter_node_id_idx'
    add_index :download_flows_mv, :importer_node_id,
      name: 'download_flows_mv_importer_node_id_idx'
    add_index :download_flows_mv, :country_node_id,
      name: 'download_flows_mv_country_node_id_idx'
    add_index :download_flows_mv,
      [:attribute_type, :attribute_id, :id],
      unique: true,
      name: 'download_flows_mv_attribute_type_attribute_id_id_idx'
    add_index :download_flows_mv,
      [:row_name, :attribute_type, :attribute_id],
      unique: true,
      name: 'download_flows_mv_row_name_attribute_type_attribute_id_idx'

    create_view :nodes_mv, version: 5, materialized: true
    add_index :nodes_mv,
      [:context_id],
      name: 'nodes_mv_context_id_idx'
    add_index :nodes_mv,
      "to_tsvector('simple', COALESCE(name, ''))",
      name: 'nodes_mv_name_idx',
      using: :gin
    add_index :nodes_mv,
      [:context_id, :id],
      unique: true,
      name: 'nodes_mv_context_id_id_idx'

    create_view :dashboards_flow_paths_mv, version: 2, materialized: true
    add_index :dashboards_flow_paths_mv,
      [:flow_id, :node_id],
      unique: true,
      name: 'dashboards_flow_paths_mv_flow_id_node_id_idx'
    add_index :dashboards_flow_paths_mv,
      :category,
      name: 'dashboards_flow_paths_mv_category_idx'

    create_view :dashboards_flow_attributes_mv, version: 2, materialized: true
    create_view :dashboards_node_attributes_mv, version: 2, materialized: true

    create_view :context_node_types_mv, materialized: true
    add_index :context_node_types_mv,
      [:context_id, :node_type_id],
      unique: true,
      name: 'context_node_types_mv_context_id_node_type_id_idx'

    create_view :dashboards_companies_mv,
                version: 3,
                materialized: true
    add_index :dashboards_companies_mv,
      :commodity_id,
      name: 'dashboards_companies_mv_commodity_id_idx'
    add_index :dashboards_companies_mv,
      :country_id,
      name: 'dashboards_companies_mv_country_id_idx'
    add_index :dashboards_companies_mv,
      [:id, :name, :node_type],
      name: 'dashboards_companies_mv_group_columns_idx'
    add_index :dashboards_companies_mv,
      :name_tsvector,
      name: 'dashboards_companies_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_companies_mv,
      :node_id,
      name: 'dashboards_companies_mv_node_id_idx'
    add_index :dashboards_companies_mv,
      :node_type_id,
      name: 'dashboards_companies_mv_node_type_id_idx'
    add_index :dashboards_companies_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_companies_mv_unique_idx'
    add_index :dashboards_companies_mv,
      :name,
      name: 'dashboards_companies_mv_name_idx'

    create_view :dashboards_destinations_mv,
                version: 3,
                materialized: true
    add_index :dashboards_destinations_mv,
      :country_id,
      name: 'dashboards_destinations_mv_country_id_idx'
    add_index :dashboards_destinations_mv,
      :commodity_id,
      name: 'dashboards_destinations_mv_commodity_id_idx'
    add_index :dashboards_destinations_mv,
      [:id, :name, :node_type],
      name: 'dashboards_destinations_mv_group_columns_idx'
    add_index :dashboards_destinations_mv,
      :name_tsvector,
      name: 'dashboards_destinations_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_destinations_mv,
      :node_id,
      name: 'dashboards_destinations_mv_node_id_idx'
    add_index :dashboards_destinations_mv,
      :node_type_id,
      name: 'dashboards_destinations_mv_node_type_id_idx'
    add_index :dashboards_destinations_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_destinations_mv_unique_idx'
    add_index :dashboards_destinations_mv,
      :name,
      name: 'dashboards_destinations_mv_name_idx'

    create_view :dashboards_countries_mv,
                version: 3,
                materialized: true
    add_index :dashboards_countries_mv,
      :commodity_id,
      name: 'dashboards_countries_mv_commodity_id_idx'
    add_index :dashboards_countries_mv,
      [:id, :name],
      name: 'dashboards_countries_mv_group_columns_idx'
    add_index :dashboards_countries_mv,
      :name_tsvector,
      name: 'dashboards_countries_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_countries_mv,
      :node_id,
      name: 'dashboards_countries_mv_node_id_idx'
    add_index :dashboards_countries_mv,
      [:id, :node_id, :commodity_id],
      unique: true,
      name: 'dashboards_countries_mv_unique_idx'
    add_index :dashboards_countries_mv,
      :name,
      name: 'dashboards_countries_mv_name_idx'

    create_view :dashboards_commodities_mv,
                version: 3,
                materialized: true
    add_index :dashboards_commodities_mv,
      :country_id,
      name: 'dashboards_commodities_mv_country_id_idx'
    add_index :dashboards_commodities_mv,
      [:id, :name],
      name: 'dashboards_commodities_mv_group_columns_idx'
    add_index :dashboards_commodities_mv,
      :name_tsvector,
      name: 'dashboards_commodities_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_commodities_mv,
      :node_id,
      name: 'dashboards_commodities_mv_node_id_idx'
    add_index :dashboards_commodities_mv,
      [:id, :node_id, :country_id],
      unique: true,
      name: 'dashboards_commodities_mv_unique_idx'
    add_index :dashboards_commodities_mv,
      :name,
      name: 'dashboards_commodities_mv_name_idx'

    create_view :dashboards_sources_mv,
                version: 3,
                materialized: true
    add_index :dashboards_sources_mv,
      :commodity_id,
      name: 'dashboards_sources_mv_commodity_id_idx'
    add_index :dashboards_sources_mv,
      :country_id,
      name: 'dashboards_sources_mv_country_id_idx'
    add_index :dashboards_sources_mv,
      [:id, :name, :node_type, :parent_name, :parent_node_type],
      name: 'dashboards_sources_mv_group_columns_idx'
    add_index :dashboards_sources_mv,
      :name_tsvector,
      name: 'dashboards_sources_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_sources_mv,
      :node_id,
      name: 'dashboards_sources_mv_node_id_idx'
    add_index :dashboards_sources_mv,
      :node_type_id,
      name: 'dashboards_sources_mv_node_type_id_idx'
    add_index :dashboards_sources_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_sources_unique_idx'
    add_index :dashboards_sources_mv,
      :name,
      name: 'dashboards_sources_mv_name_idx'

    reversible do |dir|
      dir.up do
        execute 'ALTER TABLE commodities ADD CONSTRAINT commodities_name_key UNIQUE (name)'
        execute 'ALTER TABLE countries ADD CONSTRAINT countries_iso2_key UNIQUE (iso2)'
        execute 'ALTER TABLE country_properties ADD CONSTRAINT country_properties_country_id_key UNIQUE (country_id)'
        execute 'ALTER TABLE contexts ADD CONSTRAINT contexts_country_id_commodity_id_key UNIQUE (country_id, commodity_id)'
        execute 'ALTER TABLE context_properties ADD CONSTRAINT context_properties_context_id_key UNIQUE (context_id)'
        execute 'ALTER TABLE download_versions ADD CONSTRAINT download_versions_context_id_symbol_key UNIQUE (context_id, symbol)'
        execute 'ALTER TABLE node_types ADD CONSTRAINT node_types_name_key UNIQUE (name)'
        execute 'ALTER TABLE context_node_types ADD CONSTRAINT context_node_types_context_id_node_type_id_key UNIQUE (context_id, node_type_id)'
        execute 'ALTER TABLE context_node_type_properties ADD CONSTRAINT context_node_type_properties_context_node_type_id_key UNIQUE (context_node_type_id)'
        execute 'ALTER TABLE inds ADD CONSTRAINT inds_name_key UNIQUE (name)'
        execute "ALTER TABLE ind_properties ADD CONSTRAINT ind_properties_unit_type_check CHECK (unit_type IN ('currency', 'ratio', 'score', 'unitless') )"
        execute 'ALTER TABLE ind_properties ADD CONSTRAINT ind_properties_ind_id_key UNIQUE (ind_id)'
        execute 'ALTER TABLE quants ADD CONSTRAINT quants_name_key UNIQUE (name)'
        execute "ALTER TABLE quant_properties ADD CONSTRAINT quant_properties_unit_type_check CHECK (unit_type IN ('currency', 'area', 'count', 'volume', 'unitless'))"
        execute 'ALTER TABLE quant_properties ADD CONSTRAINT quant_properties_quant_id_key UNIQUE (quant_id)'
        execute 'ALTER TABLE quals ADD CONSTRAINT quals_name_key UNIQUE (name)'
        execute 'ALTER TABLE qual_properties ADD CONSTRAINT qual_properties_qual_id_key UNIQUE (qual_id)'
        execute 'ALTER TABLE node_properties ADD CONSTRAINT node_properties_node_id_key UNIQUE (node_id)'
        execute 'ALTER TABLE node_inds ADD CONSTRAINT node_inds_node_id_ind_id_year_key UNIQUE (node_id, ind_id, year)'
        execute 'ALTER TABLE node_quals ADD CONSTRAINT node_quals_node_id_qual_id_year_key UNIQUE (node_id, qual_id, year)'
        execute 'ALTER TABLE node_quants ADD CONSTRAINT node_quants_node_id_quant_id_year_key UNIQUE (node_id, quant_id, year)'
        execute 'ALTER TABLE flows ADD CONSTRAINT flows_path_length_check CHECK (ICOUNT(path) > 3)'
        execute 'ALTER TABLE flow_inds ADD CONSTRAINT flow_inds_flow_id_ind_id_key UNIQUE (flow_id, ind_id)'
        execute 'ALTER TABLE flow_quals ADD CONSTRAINT flow_quals_flow_id_qual_id_key UNIQUE (flow_id, qual_id)'
        execute 'ALTER TABLE flow_quants ADD CONSTRAINT flow_quants_flow_id_quant_id_key UNIQUE (flow_id, quant_id)'
        execute 'ALTER TABLE map_attribute_groups ADD CONSTRAINT map_attribute_groups_context_id_position_key UNIQUE (context_id, position)'
        execute 'ALTER TABLE map_attributes ADD CONSTRAINT map_attributes_map_attribute_group_id_position_key UNIQUE (map_attribute_group_id, position)'
        execute 'ALTER TABLE map_quants ADD CONSTRAINT map_quants_map_attribute_id_quant_id_key UNIQUE (map_attribute_id, quant_id)'
        execute 'ALTER TABLE map_inds ADD CONSTRAINT map_inds_map_attribute_id_ind_id_key UNIQUE (map_attribute_id, ind_id)'
        execute 'ALTER TABLE recolor_by_attributes ADD CONSTRAINT recolor_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'
        execute 'ALTER TABLE recolor_by_inds ADD CONSTRAINT recolor_by_inds_recolor_by_attribute_id_ind_id_key UNIQUE (recolor_by_attribute_id, ind_id)'
        execute 'ALTER TABLE recolor_by_quals ADD CONSTRAINT recolor_by_quals_recolor_by_attribute_id_qual_id_key UNIQUE (recolor_by_attribute_id, qual_id)'
        execute 'ALTER TABLE resize_by_attributes ADD CONSTRAINT resize_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'
        execute 'ALTER TABLE resize_by_quants ADD CONSTRAINT resize_by_quants_resize_by_attribute_id_quant_id_key UNIQUE (resize_by_attribute_id, quant_id)'
        execute 'ALTER TABLE download_attributes ADD CONSTRAINT download_attributes_context_id_position_key UNIQUE (context_id, position)'
        execute 'ALTER TABLE download_quants ADD CONSTRAINT download_quants_download_attribute_id_quant_id_key UNIQUE (download_attribute_id, quant_id)'
        execute 'ALTER TABLE download_quals ADD CONSTRAINT download_quals_download_attribute_id_qual_id_key UNIQUE (download_attribute_id, qual_id)'
        execute 'ALTER TABLE contextual_layers ADD CONSTRAINT contextual_layers_context_id_position_key UNIQUE (context_id, position)'
        execute 'ALTER TABLE contextual_layers ADD CONSTRAINT contextual_layers_context_id_identifier_key UNIQUE (context_id, identifier)'
        execute 'ALTER TABLE carto_layers ADD CONSTRAINT carto_layers_contextual_layer_id_identifier_key UNIQUE (contextual_layer_id, identifier)'
        execute 'ALTER TABLE profiles ADD CONSTRAINT profiles_context_node_type_id_name_key UNIQUE (context_node_type_id, name)'
        execute "ALTER TABLE profiles ADD CONSTRAINT profiles_name_check CHECK (name IN ('actor', 'place'))"
        execute 'ALTER TABLE charts ADD CONSTRAINT charts_profile_id_parent_id_position_key UNIQUE (profile_id, parent_id, position)'
        execute 'ALTER TABLE charts ADD CONSTRAINT charts_profile_id_parent_id_identifier_key UNIQUE (profile_id, parent_id, identifier)'
        execute 'ALTER TABLE chart_attributes ADD CONSTRAINT chart_attributes_chart_id_identifier_key UNIQUE (chart_id, identifier)'
        execute 'ALTER TABLE chart_quants ADD CONSTRAINT chart_quants_chart_attribute_id_quant_id_key UNIQUE (chart_attribute_id, quant_id)'
        execute 'ALTER TABLE chart_inds ADD CONSTRAINT chart_inds_chart_attribute_id_ind_id_key UNIQUE (chart_attribute_id, ind_id)'
        execute 'ALTER TABLE chart_quals ADD CONSTRAINT chart_quals_chart_attribute_id_qual_id_key UNIQUE (chart_attribute_id, qual_id)'
        execute 'ALTER TABLE chart_node_types ADD CONSTRAINT chart_node_types_chart_id_identifier_position_key UNIQUE (chart_id, identifier, position)'
        execute "ALTER TABLE database_updates ADD CONSTRAINT database_updates_status_check CHECK (status IN ('STARTED', 'FINISHED', 'FAILED'))"
        execute 'ALTER TABLE database_updates ADD CONSTRAINT database_updates_jid_key UNIQUE (jid)'
        execute 'ALTER TABLE dashboards_attribute_groups ADD CONSTRAINT dashboards_attribute_groups_position_key UNIQUE (position)'
        execute 'ALTER TABLE dashboards_attributes ADD CONSTRAINT dashboards_attributes_dashboards_attribute_group_id_position_key UNIQUE (dashboards_attribute_group_id, position)'
        execute 'ALTER TABLE dashboards_inds ADD CONSTRAINT dashboards_inds_dashboards_attribute_id_ind_id_key UNIQUE (dashboards_attribute_id, ind_id)'
        execute 'ALTER TABLE dashboards_quals ADD CONSTRAINT dashboards_quals_dashboards_attribute_id_qual_id_key UNIQUE (dashboards_attribute_id, qual_id)'
        execute 'ALTER TABLE dashboards_quants ADD CONSTRAINT dashboards_quants_dashboards_attribute_id_quant_id_key UNIQUE (dashboards_attribute_id, quant_id)'

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

          COMMENT ON FUNCTION bucket_index(double precision[], double precision) IS
          'Given an n-element array of choropleth buckets and a positive value, returns index of bucket where value falls (1 to n + 1); else returns 0.';
        SQL

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

      dir.down do |dir|
        execute 'DROP FUNCTION bucket_index(double precision[], double precision)'
        execute 'DROP FUNCTION aggregated_buckets(double precision[], integer[], integer[], text)'
      end
    end
  end
end