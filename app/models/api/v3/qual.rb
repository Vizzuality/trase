# == Schema Information
#
# Table name: quals
#
#  id                                                                                                                                          :integer          not null, primary key
#  name(Attribute short name, e.g. ZERO_DEFORESTATION; those literals are referred to in code, therefore should not be changed without notice) :text             not null
#
# Indexes
#
#  quals_name_key  (name) UNIQUE
#

module Api
  module V3
    class Qual < BlueTable
      has_one :qual_property
      has_many :node_quals
      has_many :qual_context_properties
      has_many :qual_commodity_properties
      has_many :qual_country_properties

      delegate :display_name, to: :qual_property, allow_nil: true

      def readonly_attribute
        Api::V3::Readonly::Attribute.
          where(original_type: 'Qual', original_id: id).
          first
      end

      def simple_type
        'qual'
      end

      def self.select_options
        order(:name).map { |qual| [qual.name, qual.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
