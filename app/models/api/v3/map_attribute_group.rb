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
      include Api::V3::Import::YellowTableHelpers

      has_many :map_attributes

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
