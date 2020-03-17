ActiveAdmin.register Api::V3::ChartNodeType, as: 'ChartNodeType' do
  menu parent: 'Profiles', priority: 6

  includes [
    {chart: {profile: {context_node_type: [{context: [:country, :commodity]}, :node_type]}}},
    :node_type
  ]

  permit_params :chart_id, :node_type_id, :identifier, :position

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
      input :chart,
            as: :select,
            required: true,
            collection: Api::V3::Chart.select_options
      input :node_type,
            as: :select,
            required: true,
            collection: Api::V3::NodeType.select_options
      input :identifier,
            as: :string,
            hint: object.class.column_comment('identifier')
      input :position, hint: object.class.column_comment('position')
    end
    f.actions
  end

  index do
    column('Country', sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.country&.name
    end
    column('Commodity', sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.commodity&.name
    end
    column('Node Type', sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.node_type&.name
    end
    column('Profile Node Type', sortable: true) { |attribute| attribute.chart&.profile&.name }
    column :chart
    column :node_type
    column :identifier
    column :position
    actions
  end

  show do
    attributes_table do
      row('Country') do |attribute|
        attribute.chart&.profile&.context_node_type&.context&.country&.name
      end
      row('Commodity') do |attribute|
        attribute.chart&.profile&.context_node_type&.context&.commodity&.name
      end
      row('Profile node type') do |attribute|
        attribute.chart&.profile&.context_node_type&.node_type&.name
      end
      row('Profile type') { |attribute| attribute.chart&.profile&.name }
      row :chart
      row :node_type
      row :identifier
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :chart_profile_context_node_type_context_country_id,
         label: 'Country',
         as: :select,
         collection: -> { Api::V3::Country.select_options }

  filter :chart_profile_context_node_type_context_commodity_id,
         label: 'Commodity',
         as: :select,
         collection: -> { Api::V3::Commodity.select_options }

  filter :chart_profile_context_node_type_context_id,
         label: 'Context',
         as: :select,
         collection: -> { Api::V3::Context.select_options }

  filter :chart_profile_context_node_type_node_type_id,
         label: 'Profile node type',
         as: :select,
         collection: -> { Api::V3::NodeType.select_options }

  filter :chart_profile_name,
         label: 'Profile type',
         as: :select,
         collection: -> { Api::V3::Profile::NAMES }

  filter :chart_profile_id,
         as: :select,
         collection: -> { Api::V3::Profile.select_options }

  filter :chart, collection: -> { Api::V3::Chart.select_options }

  filter :chart_identifier,
         label: 'Chart identifier',
         as: :select,
         collection: -> { Api::V3::Chart.distinct.pluck(:identifier).sort }
end
