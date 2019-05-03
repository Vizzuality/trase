# == Schema Information
#
# Table name: attributes_mv
#
#  id(The unique id is a sequential number which is generated at REFRESH and therefore not fixed.) :bigint(8)        primary key
#  original_type(Type of the original entity (Ind / Qual / Quant))                                 :text
#  original_id(Id from the original table (inds / quals / quants))                                 :integer
#  name                                                                                            :text
#  display_name                                                                                    :text
#  unit                                                                                            :text
#  unit_type                                                                                       :text
#  tooltip_text                                                                                    :text
#  is_visible_on_actor_profile                                                                     :boolean
#  is_visible_on_place_profile                                                                     :boolean
#  is_temporal_on_actor_profile                                                                    :boolean
#  is_temporal_on_place_profile                                                                    :boolean
#  aggregate_method                                                                                :text
#
# Indexes
#
#  attributes_mv_id_idx    (id) UNIQUE
#  attributes_mv_name_idx  (name) UNIQUE
#

module Api
  module V3
    module Readonly
      class Attribute < Api::V3::Readonly::BaseModel
        self.table_name = 'attributes_mv'
        self.primary_key = 'id'

        def self.select_options
          order(:display_name).map do |a|
            ["#{a.display_name} (#{a.name})", a.id]
          end
        end

        def self.refresh_dependents(options = {})
          [
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute,
            Api::V3::Readonly::DashboardsAttribute
          ].each do |mview_klass|
            mview_klass.refresh(options.merge(skip_dependencies: true))
          end
        end

        # Used in dashbooards to determine whether values are present in flows
        # values tables (flow_inds/quals/quants)
        def flows_values?
          flow_values_class.where(
            attribute_id_name => original_id
          ).any?
        end

        def flow_values_class
          "Api::V3::Flow#{original_type}".constantize
        end

        def node_values_class
          "Api::V3::Node#{original_type}".constantize
        end

        def attribute_id_name
          "#{original_type.downcase}_id"
        end

        def ind?
          original_type == 'Ind'
        end

        def qual?
          original_type == 'Qual'
        end

        def quant?
          original_type == 'Quant'
        end

        def aggregatable?
          quant? || ind?
        end

        def temporal?
          is_temporal_on_actor_profile? || is_temporal_on_place_profile?
        end

        # overrides aggregate_method
        def value_aggregate_method
          if quant?
            'SUM'
          elsif ind?
            'AVG'
          end
        end
      end
    end
  end
end
