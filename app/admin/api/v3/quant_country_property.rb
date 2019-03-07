ActiveAdmin.register Api::V3::QuantCountryProperty, as: 'QuantCountryProperty' do
  menu parent: 'General'

  permit_params :quant_id, :country_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :quant, as: :select, required: true,
                    collection: Api::V3::Quant.select_options
      input :country, as: :select, required: true,
                      collection: Api::V3::Country.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Quant name') { |property| property.quant&.name }
    column('Country') { |property| property.country&.name }
    column :tooltip_text
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
  filter :country, collection: -> { Api::V3::Country.select_options }
end
