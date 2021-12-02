ActiveAdmin.register Api::V3::MethodsAndDataDoc, as: 'MethodsAndDataDoc' do
  menu parent: 'General', priority: 2

  permit_params :context_id, :version, :language, :url

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :version, as: :string, required: true
      input :language, as: :select, required: true,
                      collection: Api::V3::MethodsAndDataDoc.language_options
      input :url, as: :string, required: true
    end
    f.actions
  end

  index do
    column('Country') { |doc| doc.context&.country&.name }
    column('Commodity') { |doc| doc.context&.commodity&.name }
    column :version
    column :language_name
    column :url
    actions
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
