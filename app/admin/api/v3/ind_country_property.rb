ActiveAdmin.register Api::V3::IndCountryProperty, as: 'IndCountryProperty' do
  menu parent: 'Tooltips', priority: 2

  permit_params :ind_id, :country_id, :tooltip_text

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
      input :country, as: :select, required: true,
                      collection: Api::V3::Country.select_options
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment('tooltip_text')
    end
    f.actions
  end

  index do
    div Api::V3::IndCountryProperty.column_comment('tooltip_text')
    div do
      link_to 'Link to context-specific tooltip', admin_ind_context_properties_path
    end
    div do
      link_to 'Link to commodity-specific tooltip', admin_ind_commodity_properties_path
    end
    br br
    column('Ind name') { |property| property.ind&.name }
    column('Country') { |property| property.country&.name }
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
  filter :country, collection: -> { Api::V3::Country.select_options }
end
