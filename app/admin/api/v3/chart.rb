ActiveAdmin.register Api::V3::Chart, as: 'Chart' do
  menu parent: 'Profiles', priority: 4

  permit_params :profile_id, :parent_id, :identifier, :title, :position

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts/.+/places')
      clear_cache_for_regexp('/api/v3/contexts/.+/actors')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :profile, as: :select, required: true,
                      collection: Api::V3::Profile.select_options
      input :parent, as: :select, required: true,
                     collection: Api::V3::Chart.select_options
      input :identifier, required: true, as: :string,
                         hint: object.class.column_comment('identifier')
      input :title, required: true, as: :string,
                    hint: object.class.column_comment('title')
      input :position, required: true,
                       hint: object.class.column_comment('position')
    end
    f.actions
  end

  index do
    column('Country', sortable: true) do |chart|
      chart.profile&.context_node_type&.context&.country&.name
    end
    column('Commodity', sortable: true) do |chart|
      chart.profile&.context_node_type&.context&.commodity&.name
    end
    column('Node Type', sortable: true) do |chart|
      chart.profile&.context_node_type&.node_type&.name
    end
    column('Profile Type', sortable: true) { |chart| chart.profile&.name }
    column('Parent', sortable: true) { |chart| chart.parent&.identifier }
    column :title
    column :identifier
    column :position
    actions
  end

  show do
    attributes_table do
      row('Country') do |chart|
        chart.profile&.context_node_type&.context&.country&.name
      end
      row('Commodity') do |chart|
        chart.profile&.context_node_type&.context&.commodity&.name
      end
      row('Node Type') do |chart|
        chart.profile&.context_node_type&.node_type&.name
      end
      row('Profile Type') { |chart| chart.profile&.name }
      row('Parent') { |chart| chart.parent&.title }
      row :title
      row :identifier
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :profile_context_node_type_context_country_id,
         label: 'Country',
         as: :select,
         collection: -> { Api::V3::Country.select_options }

  filter :profile_context_node_type_context_commodity_id,
         label: 'Commodity',
         as: :select,
         collection: -> { Api::V3::Commodity.select_options }

  filter :profile_context_node_type_context_id,
         label: 'Context',
         as: :select,
         collection: -> { Api::V3::Context.select_options }

  filter :profile_context_node_type_node_type_id,
         label: 'Node type',
         as: :select,
         collection: -> { Api::V3::NodeType.select_options }

  filter :profile_name,
         label: 'Profile type',
         as: :select,
         collection: -> { Api::V3::Profile::NAMES }

  filter :profile, collection: -> { Api::V3::Profile.select_options }

  filter :identifier, as: :select
end
