ActiveAdmin.register Api::V3::IndProperty, as: 'IndProperty' do
  menu parent: 'Tooltips', priority: 4

  permit_params :ind_id, :display_name, :unit_type, :tooltip_text

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
      Dictionary::Ind.instance.reset
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :ind, as: :select, required: true,
                  collection: Api::V3::Ind.select_options
      input :display_name, required: true, as: :string,
                           hint: object.class.column_comment('display_name')
      input :unit_type, as: :select,
                        collection: Api::V3::IndProperty::UNIT_TYPE,
                        hint: object.class.column_comment('unit_type')
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Name') { |property| property.ind&.name }
    column :display_name
    column :unit_type
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
end
