ActiveAdmin.register Api::V3::DownloadAttribute, as: 'DownloadAttribute' do
  menu parent: 'Yellow Tables'

  permit_params :context_id, :position, :display_name, :years_str

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
        collection: Api::V3::Context.select_options
      input :position, required: true
      input :display_name, required: true, as: :string
      input :years_str, hint: 'Comma-separated list of years', label: 'Years'
    end
    f.actions
  end

  index do
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :position
    column :display_name
    column :years
    actions
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
