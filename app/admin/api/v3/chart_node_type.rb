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
    column('Country') do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.country&.name
    end
    column('Commodity') do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.commodity&.name
    end
    column('Profile Node Type') do |attribute|
      attribute.chart&.profile&.context_node_type&.node_type&.name
    end
    column('Profile Type') { |attribute| attribute.chart&.profile&.name }
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
      row('Profile Node Type') do |attribute|
        attribute.chart&.profile&.context_node_type&.node_type&.name
      end
      row('Profile Type') { |attribute| attribute.chart&.profile&.name }
      row :chart
      row :node_type
      row :identifier
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :chart_profile_id, label: 'Profile', as: :select, collection: -> {
    Api::V3::Profile.select_options
  }

  filter :chart, collection: -> {
    Api::V3::Chart.select_options
  }
end
