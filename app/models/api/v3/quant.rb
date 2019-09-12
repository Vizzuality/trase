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
      has_one :quant_values_meta, class_name: 'Api::V3::Readonly::QuantValuesMeta'
      has_many :node_quants
      has_many :flow_quants
      has_many :flows, through: :flow_quants
      has_many :quant_context_properties
      has_many :quant_commodity_properties
      has_many :quant_country_properties
      has_many :nodes_stats

      delegate :display_name, to: :quant_property, allow_nil: true
      alias_method :values_meta, :quant_values_meta
      alias_method :node_values, :node_quants

      def readonly_attribute
        Api::V3::Readonly::Attribute.
          where(original_type: 'Quant', original_id: id).
          first
      end

      def simple_type
        'quant'
      end

      def download_original_attribute(context)
        Api::V3::DownloadQuant.
          joins(:download_attribute).
          find_by('download_attributes.context_id' => context.id, quant_id: id)
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
