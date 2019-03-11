ActiveAdmin.register Api::V3::QuantContextProperty, as: 'QuantContextProperty' do
  menu parent: 'Tooltips', priority: 9

  permit_params :quant_id, :context_id, :tooltip_text

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
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    div Api::V3::QuantContextProperty.column_comment('tooltip_text')
    div do
      link_to 'Link to country-specific tooltip', admin_quant_country_properties_path
    end
    br br
    column('Quant name') { |property| property.quant&.name }
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
  filter :context, collection: -> { Api::V3::Context.select_options }
end
