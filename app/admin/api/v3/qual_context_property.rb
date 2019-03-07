ActiveAdmin.register Api::V3::QualContextProperty, as: 'QualContextProperty' do
  menu parent: 'General'

  permit_params :qual_id, :context_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :qual, as: :select, required: true,
                   collection: Api::V3::Qual.select_options
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Qual name') { |property| property.qual&.name }
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :qual, collection: -> { Api::V3::Qual.select_options }
  filter :context, collection: -> { Api::V3::Context.select_options }
end
