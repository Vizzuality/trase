ActiveAdmin.register Api::V3::IndCommodityProperty, as: 'IndCommodityProperty' do
  menu parent: 'General'

  permit_params :ind_id, :commodity_id, :tooltip_text

  form do |f|
    f.semantic_errors
    inputs do
      input :ind, as: :select, required: true,
                  collection: Api::V3::Ind.select_options
      input :commodity, as: :select, required: true,
                        collection: Api::V3::Commodity.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Ind name') { |property| property.ind&.name }
    column('Commodity') { |property| property.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
