ActiveAdmin.register Content::Page, as: 'Page' do
  menu parent: 'Content'

  permit_params :name, :content
  config.sort_order = :name

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string, hint: 'Page name used in URL'
      input :content,
            required: true,
            as: :simplemde_editor,
            hint: 'Page content formatted in markdown'
    end
    f.actions
  end

  show do
    attributes_table do
      row :name
      row :content
    end
  end

  index download_links: false do
    column :name
    actions
  end

  filter :name
end
