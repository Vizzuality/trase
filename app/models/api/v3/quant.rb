# == Schema Information
#
# Table name: quants
#
#  id                                                                                                                           :integer          not null, primary key
#  name(Attribute short name, e.g. FOB; those literals are referred to in code, therefore should not be changed without notice) :text             not null
#  unit(Unit in which values for this attribute are given)                                                                      :text
#
# Indexes
#
#  quants_name_key  (name) UNIQUE
#

module Api
  module V3
    class Quant < BlueTable
      has_one :quant_property
      has_many :node_quants
      has_many :quant_context_properties
      has_many :quant_commodity_properties
      has_many :quant_country_properties

      delegate :display_name, to: :quant_property, allow_nil: true

      def readonly_attribute
        Api::V3::Readonly::Attribute.
          where(original_type: 'Quant', original_id: id).
          first
      end

      def simple_type
        'quant'
      end

      def self.select_options
        order(:name).map { |quant| [quant.name, quant.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
