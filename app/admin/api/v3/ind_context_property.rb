ActiveAdmin.register Api::V3::IndContextProperty, as: 'IndContextProperty' do
  menu parent: 'Tooltips', priority: 1

  permit_params :ind_id, :context_id, :tooltip_text

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :ind, as: :select, required: true,
                  collection: Api::V3::Ind.select_options
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    div Api::V3::IndContextProperty.column_comment('tooltip_text')
    div do
      link_to 'Link to country-specific tooltip', admin_ind_country_properties_path
    end
    br br
    column('Ind name') { |property| property.ind&.name }
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
  filter :context, collection: -> { Api::V3::Context.select_options }
end
