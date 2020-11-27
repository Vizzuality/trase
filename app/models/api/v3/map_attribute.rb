# == Schema Information
#
# Table name: map_attributes
#
#  id                                                                                                                 :integer          not null, primary key
#  map_attribute_group_id                                                                                             :integer          not null
#  position(Display order in scope of group)                                                                          :integer          not null
#  dual_layer_buckets(Choropleth buckets for dual dimension choropleth)                                               :float            default([]), not null, is an Array
#  single_layer_buckets(Choropleth buckets for single dimension choropleth)                                           :float            default([]), not null, is an Array
#  color_scale(Choropleth colour scale, e.g. blue)                                                                    :text
#  years(Years for which attribute is present; empty (NULL) for all years)                                            :integer          is an Array
#  is_disabled(When set, this attribute is not displayed)                                                             :boolean          default(FALSE), not null
#  is_default(When set, show this attribute by default. A maximum of 2 attributes per context may be set as default.) :boolean          default(FALSE), not null
#
# Indexes
#
#  map_attributes_map_attribute_group_id_position_key  (map_attribute_group_id,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (map_attribute_group_id => map_attribute_groups.id) ON DELETE => cascade
#
module Api
  module V3
    class MapAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      COLOR_SCALE = %w(
        blue
        bluered
        bluered8
        green
        greenblue
        greenred
        greenred12
        red
        redblue
      ).freeze

      belongs_to :map_attribute_group
      has_one :map_ind, autosave: true
      has_one :map_quant, autosave: true

      validates :map_attribute_group, presence: true
      validates :position,
                presence: true,
                uniqueness: {scope: :map_attribute_group}
      validates :dual_layer_buckets, presence: true, array_size: {exactly: 3}
      validates :single_layer_buckets, presence: true
      validates :is_disabled, inclusion: {in: [true, false]}
      validates :is_default, inclusion: {in: [true, false]}
      validates :color_scale, inclusion: {in: COLOR_SCALE, allow_blank: true}
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:map_ind, :map_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :map_ind, scope: :map_attribute_group_id,
                     if: :new_map_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :map_quant, scope: :map_attribute_group_id,
                     if: :new_map_quant_given?

      stringy_array :dual_layer_buckets
      stringy_array :single_layer_buckets
      stringy_array :years
      manage_associated_attributes [:map_ind, :map_quant]

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_group_id, table_class: Api::V3::MapAttributeGroup}
        ]
      end

      private_class_method def self.active_ids
        Api::V3::MapInd.distinct.pluck(:map_attribute_id) +
          Api::V3::MapQuant.distinct.pluck(:map_attribute_id)
      end
    end
  end
end
