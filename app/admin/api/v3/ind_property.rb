ActiveAdmin.register Api::V3::IndProperty, as: 'IndProperty' do
  menu parent: 'General Settings'

  permit_params :ind_id, :display_name, :unit_type, :tooltip_text,
                :is_visible_on_place_profile, :is_visible_on_actor_profile,
                :is_temporal_on_place_profile, :is_temporal_on_actor_profile

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
      input :is_visible_on_place_profile, as: :boolean, required: true,
                                          hint: object.class.column_comment('is_visible_on_place_profile')
      input :is_visible_on_actor_profile, as: :boolean, required: true,
                                          hint: object.class.column_comment('is_visible_on_actor_profile')
      input :is_temporal_on_place_profile, as: :boolean, required: true,
                                           hint: object.class.column_comment('is_temporal_on_place_profile')
      input :is_temporal_on_actor_profile, as: :boolean, required: true,
                                           hint: object.class.column_comment('is_temporal_on_actor_profile')
    end
    f.actions
  end

  index do
    column :display_name
    column :unit_type
    column :tooltip_text
    actions
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
end
