ActiveAdmin.register Api::V3::QualCountryProperty, as: 'QualCountryProperty' do
  menu parent: 'General'

  permit_params :qual_id, :country_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :qual, as: :select, required: true,
                   collection: Api::V3::Qual.select_options
      input :country, as: :select, required: true,
                      collection: Api::V3::Country.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Qual name') { |property| property.qual&.name }
    column('Country') { |property| property.country&.name }
    column :tooltip_text
    actions
  end

  filter :qual, collection: -> { Api::V3::Qual.select_options }
  filter :country, collection: -> { Api::V3::Country.select_options }
end
