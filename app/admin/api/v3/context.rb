ActiveAdmin.register Api::V3::Context, as: 'Context' do
  menu priority: 2

  config.filters = false

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end

    def scoped_collection
      super.includes(:country)
      super.includes(:commodity)
    end
  end

  index do
    columns do
      column do
        panel 'Contexts' do
          ul do
            Api::V3::Readonly::Context.all.map do |context|
              li link_to([context.country_name, context.commodity_name].join(' / '), admin_context_path(context.id))
            end
          end
        end
      end
    end
  end

  show do
    attributes_table do
      row('Country') { |property| property.country&.name }
      row('Commodity') { |property| property.commodity&.name }
      row :created_at
      row :updated_at
      row('Top profiles') { |property| link_to('Top profiles', admin_context_top_profiles_path(context_id: property.id)) }
    end
  end
end
