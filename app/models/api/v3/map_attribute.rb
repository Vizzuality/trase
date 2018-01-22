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
      belongs_to :map_attribute_group

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_group_id, table_class: Api::V3::MapAttributeGroup}
        ]
      end
    end
  end
end
