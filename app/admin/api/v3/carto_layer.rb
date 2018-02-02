ActiveAdmin.register Api::V3::CartoLayer, as: 'CartoLayer' do
  menu parent: 'Yellow Tables'

  permit_params :contextual_layer_id, :identifier, :years_str, :raster_url

  form do |f|
    f.semantic_errors
    inputs do
      input :contextual_layer, as: :select, required: true,
            collection: Api::V3::ContextualLayer.select_options
      input :identifier, required: true, as: :string,
            hint: object.class.column_comment('identifier')
      input :years_str, label: 'Years',
            hint: (object.class.column_comment('years') || '') + ' (comma-separated list)'
      input :raster_url,
            hint: object.class.column_comment('raster_url')
    end
    f.actions
  end

  index do
    column('Country') { |layer| layer.contextual_layer&.context&.country&.name }
    column('Commodity') { |layer| layer.contextual_layer&.context&.commodity&.name }
    column('ContextualLayer') { |layer| layer.contextual_layer&.identifier }
    column :identifier
    column :years
    column :raster_url
    actions
  end

  filter :contextual_layer, collection: -> { Api::V3::ContextualLayer.select_options }
end
