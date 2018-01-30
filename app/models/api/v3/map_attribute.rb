# == Schema Information
#
# Table name: context_layer
#
#  id                     :integer          not null
#  map_attribute_group_id :integer          not null
#  position               :integer          not null
#  bucket_3               :float            not null          is an Array
#  bucket_5               :float            not null          is an Array
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

      COLOR_SCALE = [
        'bluered',
        'green',
        'blue',
        'red',
        'redblue',
        'greenblue'
        ].freeze

      belongs_to :map_attribute_group

      validates :map_attribute_group, presence: true
      validates :position, presence: true, uniqueness: {scope: :map_attribute_group}
      validates :bucket_3, presence: true, array_size: {exactly: 2}
      validates :bucket_5, presence: true, array_size: {exactly: 4}
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }
      validates :color_scale, inclusion: { in: COLOR_SCALE, allow_blank: true }

      stringy_array :bucket_3
      stringy_array :bucket_5
      stringy_array :years

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_group_id, table_class: Api::V3::MapAttributeGroup}
        ]
      end
    end
  end
end
