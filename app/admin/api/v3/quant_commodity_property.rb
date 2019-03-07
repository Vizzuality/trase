ActiveAdmin.register Api::V3::QuantCommodityProperty, as: 'QuantCommodityProperty' do
  menu parent: 'General'

  permit_params :quant_id, :commodity_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :quant, as: :select, required: true,
                    collection: Api::V3::Quant.select_options
      input :commodity, as: :select, required: true,
                        collection: Api::V3::Commodity.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Quant name') { |property| property.quant&.name }
    column('Commodity') { |property| property.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
