ActiveAdmin.register Api::V3::CountryProperty, as: 'CountryProperty' do
  menu parent: 'General Settings', priority: 1

  permit_params :country_id, :latitude, :longitude, :zoom

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_url(api_v3_contexts_url)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :country, as: :select, required: true
      input :latitude, required: true,
                       hint: object.class.column_comment('latitude')
      input :longitude, required: true,
                        hint: object.class.column_comment('longitude')
      input :zoom, required: true,
                   hint: object.class.column_comment('zoom')
    end
    f.actions
  end

  index download_links: false do
    column('Country') { |property| property.country&.name }
    column :latitude
    column :longitude
    column :zoom
    actions
  end

  filter :country
end
