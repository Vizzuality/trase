ActiveAdmin.register Api::V3::QuantProperty, as: 'QuantProperty' do
  menu parent: 'Yellow Tables'

  permit_params :quant_id, :display_name, :unit_type, :tooltip_text,
                :is_visible_on_place_profile, :is_visible_on_actor_profile,
                :is_temporal_on_place_profile, :is_temporal_on_actor_profile

  form do |f|
    f.semantic_errors
    inputs do
      input :quant, as: :select, required: true,
        collection: Api::V3::Quant.select_options
      input :display_name, required: true, as: :string
      input :unit_type, as: :select,
        collection: Api::V3::QuantProperty::UNIT_TYPE
      input :tooltip_text, as: :string
      input :is_visible_on_place_profile, as: :boolean, required: true
      input :is_visible_on_actor_profile, as: :boolean, required: true
      input :is_temporal_on_place_profile, as: :boolean, required: true
      input :is_temporal_on_actor_profile, as: :boolean, required: true
    end
    f.actions
  end

  index do
    column('Quant') { |property| property.quant&.name }
    column :display_name
    column :unit_type
    column :tooltip_text
    column :is_visible_on_place_profile
    column :is_visible_on_actor_profile
    column :is_temporal_on_place_profile
    column :is_temporal_on_actor_profile
    actions
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
end
