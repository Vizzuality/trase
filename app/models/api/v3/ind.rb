# == Schema Information
#
# Table name: inds
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  unit       :text
#  created_at :datetime         not null
#
# Indexes
#
#  inds_name_key  (name) UNIQUE
#

module Api
  module V3
    class Ind < BlueTable
      has_one :ind_property
      has_many :node_inds
      has_many :ind_context_properties
      has_many :ind_commodity_properties
      has_many :ind_country_properties

      delegate :display_name, to: :ind_property, allow_nil: true

      def readonly_attribute
        Api::V3::Readonly::Attribute.
          where(original_type: 'Ind', original_id: id).
          first
      end

      def simple_type
        'ind'
      end

      def self.select_options
        order(:name).map { |ind| [ind.name, ind.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
