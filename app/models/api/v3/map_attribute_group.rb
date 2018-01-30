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
    class MapAttributeGroup < YellowTable
      belongs_to :context
      has_many :map_attributes

      validates :context, presence: true
      validates :name, presence: true
      validates :position, presence: true, uniqueness: {scope: :context}

      def self.select_options
        Api::V3::MapAttributeGroup.all.map do |group|
          [
            [
              group.context&.country&.name,
              group.context&.commodity&.name,
              group.name
            ].join(' / '),
            group.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
