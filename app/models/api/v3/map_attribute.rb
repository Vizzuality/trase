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
    class MapAttribute < BaseModel
      belongs_to :map_attribute_group
    end
  end
end
