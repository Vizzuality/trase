ActiveAdmin.register Api::V3::QuantCommodityProperty, as: 'QuantCommodityProperty' do
  menu parent: 'Tooltips', priority: 11

  permit_params :quant_id, :commodity_id, :tooltip_text

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

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
    div Api::V3::QuantCommodityProperty.column_comment('tooltip_text')
    div do
      link_to 'Link to country-specific tooltip', admin_quant_country_properties_path
    end
    div do
      link_to 'Link to generic tooltip', admin_quant_properties_path
    end
    br br
    column('Quant name') { |property| property.quant&.name }
    column('Commodity') { |property| property.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
