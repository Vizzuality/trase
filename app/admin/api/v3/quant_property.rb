ActiveAdmin.register Api::V3::QuantProperty, as: 'QuantProperty' do
  menu parent: 'Tooltips', priority: 12

  permit_params :quant_id, :display_name, :unit_type, :tooltip_text

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
      Dictionary::Quant.instance.reset
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :quant, as: :select, required: true,
                    collection: Api::V3::Quant.select_options
      input :display_name, required: true, as: :string,
                           hint: object.class.column_comment('display_name')
      input :unit_type, as: :select,
                        collection: Api::V3::QuantProperty::UNIT_TYPE,
                        hint: object.class.column_comment('unit_type')
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Name') { |property| property.quant&.name }
    column :display_name
    column :unit_type
    column :tooltip_text
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
end
