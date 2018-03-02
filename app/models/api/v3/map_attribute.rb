# == Schema Information
#
# Table name: context_layer
#
#  id                     :integer          not null
#  map_attribute_group_id :integer          not null
#  position               :integer          not null
#  dual_layer_buckets               :float            not null          is an Array
#  single_layer_buckets               :float            not null          is an Array
#  is_default             :boolean          not null          default("false")
#  is_disabled            :boolean          not null          default("false")
#  color_scale            :string
#  years                  :integer          is an Array
#  created_at             :datetime
#  updated_at             :datetime
#

module Api
  module V3
    class MapAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      COLOR_SCALE = %w(
        bluered
        green
        blue
        red
        redblue
        greenblue
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
                     attribute: :map_ind, scope: :map_attribute_group,
                     if: :new_map_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :map_quant, scope: :map_attribute_group,
                     if: :new_map_quant_given?

      after_commit :refresh_dependencies

      stringy_array :dual_layer_buckets
      stringy_array :single_layer_buckets
      stringy_array :years
      manage_associated_attributes [:map_ind, :map_quant]

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_group_id, table_class: Api::V3::MapAttributeGroup}
        ]
      end

      def refresh_dependencies
        Api::V3::Readonly::MapAttribute.refresh
      end
    end
  end
end
