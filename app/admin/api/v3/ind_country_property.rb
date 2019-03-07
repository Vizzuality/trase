ActiveAdmin.register Api::V3::IndCountryProperty, as: 'IndCountryProperty' do
  menu parent: 'General'

  permit_params :ind_id, :country_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :ind, as: :select, required: true,
                  collection: Api::V3::Ind.select_options
      input :country, as: :select, required: true,
                      collection: Api::V3::Country.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Ind name') { |property| property.ind&.name }
    column('Country') { |property| property.country&.name }
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
  filter :country, collection: -> { Api::V3::Country.select_options }
end
