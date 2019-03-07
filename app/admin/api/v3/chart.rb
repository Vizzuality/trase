ActiveAdmin.register Api::V3::Chart, as: 'Chart' do
  menu parent: 'Profiles', priority: 2

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
    column('Country') do |chart|
      chart.profile&.context_node_type&.context&.country&.name
    end
    column('Commodity') do |chart|
      chart.profile&.context_node_type&.context&.commodity&.name
    end
    column('Node Type') do |chart|
      chart.profile&.context_node_type&.node_type&.name
    end
    column('Profile Type') { |chart| chart.profile&.name }
    column('Parent') { |chart| chart.parent&.identifier }
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

  filter :profile, collection: -> { Api::V3::Profile.select_options }
end
