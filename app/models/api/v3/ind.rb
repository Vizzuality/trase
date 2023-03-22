# == Schema Information
#
# Table name: inds
#
#  id                                                                                                                                  :integer          not null, primary key
#  name(Attribute short name, e.g. FOREST_500; those literals are referred to in code, therefore should not be changed without notice) :text             not null
#  unit(Unit in which values for this attribute are given)                                                                             :text
#
# Indexes
#
#  inds_name_key  (name) UNIQUE
#
module Api
  module V3
    class Ind < BlueTable
      has_one :ind_property
      has_one :ind_values_meta, class_name: "Api::V3::Readonly::IndValuesMeta"
      has_many :node_inds
      has_many :flow_inds
      has_many :flows, through: :flow_inds
      has_many :ind_context_properties
      has_many :ind_commodity_properties
      has_many :ind_country_properties

      delegate :display_name, to: :ind_property, allow_nil: true
      alias_method :values_meta, :ind_values_meta
      alias_method :node_values, :node_inds

      def readonly_attribute
        Api::V3::Readonly::Attribute.
          where(original_type: "Ind", original_id: id).
          first
      end

      def simple_type
        "ind"
      end

      def self.select_options
        order(:name).map { |ind| [ind.name, ind.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: "TEXT"}
        ]
      end
    end
  end
end
