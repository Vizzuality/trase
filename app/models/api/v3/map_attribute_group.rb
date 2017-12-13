# == Schema Information
#
# Table name: map_attribute_groups
#
#  id         :integer          not null, primary key
#  name       :text
#  position   :integer
#  context_id :integer
#  created_at :datetime
#  updated_at :date_time

module Api
  module V3
    class MapAttributeGroup < BaseModel
      has_many :map_attributes
    end
  end
end
