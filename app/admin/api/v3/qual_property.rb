ActiveAdmin.register Api::V3::QualProperty, as: 'QualProperty' do
  menu parent: 'Tooltips', priority: 8

  permit_params :qual_id, :display_name, :tooltip_text

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
      Dictionary::Qual.instance.reset
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :qual, as: :select, required: true,
                   collection: Api::V3::Qual.select_options
      input :display_name, required: true, as: :string,
                           hint: object.class.column_comment('display_name')
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    column('Name') { |property| property.qual&.name }
    column :display_name
    column :tooltip_text
    actions
  end

  filter :qual, collection: -> { Api::V3::Qual.select_options }
end
