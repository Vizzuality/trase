ActiveAdmin.register Api::V3::Profile, as: 'Profile' do
  menu parent: 'Profiles', priority: 1

  permit_params :context_node_type_id,
                :name, :main_topojson_path,
                :main_topojson_root,
                :adm_1_topojson_path,
                :adm_1_topojson_root,
                :adm_1_name,
                :adm_2_topojson_path,
                :adm_2_topojson_root,
                :adm_2_name

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts/')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :context_node_type, as: :select, required: true,
                                collection: Api::V3::ContextNodeType.select_options
      input :name, as: :select,
                   collection: Api::V3::Profile::NAME,
                   hint: object.class.column_comment('name')

      input :main_topojson_path,
            hint: object.class.column_comment('main_topojson_path'),
            label: 'Main map TopoJSON file path'
      input :main_topojson_root,
            hint: object.class.column_comment('main_topojson_root'),
            label: 'Main map TopoJSON root'

      input :adm_1_name,
            label: 'Map 1 label'
      input :adm_1_topojson_path,
            hint: object.class.column_comment('adm_1_topojson_path'),
            label: 'Map 1 TopoJSON file path'
      input :adm_1_topojson_root,
            hint: object.class.column_comment('adm_1_topojson_root'),
            label: 'Map 1 TopoJSON root'

      input :adm_2_name,
            label: 'Map 2 label'
      input :adm_2_topojson_path,
            hint: object.class.column_comment('adm_2_topojson_path'),
            label: 'Map 2 TopoJSON file path'
      input :adm_2_topojson_root,
            hint: object.class.column_comment('adm_2_topojson_root'),
            label: 'Map 2 TopoJSON root'
    end
    f.actions
  end

  index do
    column('Country') { |property| property.context_node_type&.context&.country&.name }
    column('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
    column('Node Type') { |property| property.context_node_type&.node_type&.name }
    column :name
    actions
  end

  show do
    attributes_table do
      row('Country') { |property| property.context_node_type&.context&.country&.name }
      row('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
      row('Node Type') { |property| property.context_node_type&.node_type&.name }
      row :name
      row :adm_1_topojson_path
      row :adm_1_topojson_root
      row :adm_2_topojson_path
      row :adm_2_topojson_root
      row :main_topojson_path
      row :main_topojson_root
      row :created_at
      row :updated_at
    end
  end

  filter :context_node_type, collection: -> {
    Api::V3::ContextNodeType.
      select_options
  }

  filter :context_node_type, collection: -> {
    Api::V3::ContextNodeType.select_options
  }
end
