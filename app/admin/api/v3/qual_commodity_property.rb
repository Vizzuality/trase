ActiveAdmin.register Api::V3::QualCommodityProperty, as: 'QualCommodityProperty' do
  menu parent: 'General'

  permit_params :qual_id, :commodity_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :qual, as: :select, required: true,
                   collection: Api::V3::Qual.select_options
      input :commodity, as: :select, required: true,
                        collection: Api::V3::Commodity.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Qual name') { |property| property.qual&.name }
    column('Commodity') { |property| property.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :qual, collection: -> { Api::V3::Qual.select_options }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
