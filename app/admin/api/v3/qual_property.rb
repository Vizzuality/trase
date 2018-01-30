ActiveAdmin.register Api::V3::QualProperty, as: 'QualProperty' do
  menu parent: 'Yellow Tables'

  permit_params :qual_id, :display_name, :tooltip_text,
                :is_visible_on_place_profile, :is_visible_on_actor_profile,
                :is_temporal_on_place_profile, :is_temporal_on_actor_profile

  form do |f|
    f.semantic_errors
    inputs do
      input :qual, as: :select, required: true,
        collection: Api::V3::Qual.select_options
      input :display_name, required: true, as: :string
      input :tooltip_text, as: :string
      input :is_visible_on_place_profile, as: :boolean, required: true
      input :is_visible_on_actor_profile, as: :boolean, required: true
      input :is_temporal_on_place_profile, as: :boolean, required: true
      input :is_temporal_on_actor_profile, as: :boolean, required: true
    end
    f.actions
  end

  index do
    column('Qual') { |property| property.qual&.name }
    column :display_name
    column :tooltip_text
    column :is_visible_on_place_profile
    column :is_visible_on_actor_profile
    column :is_temporal_on_place_profile
    column :is_temporal_on_actor_profile
    actions
  end

  filter :qual, collection: -> { Api::V3::Qual.select_options }
end
