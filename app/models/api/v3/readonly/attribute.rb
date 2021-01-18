# == Schema Information
#
# Table name: attributes
#
#  id(Id is fixed between data updates, unless name changes)       :bigint(8)        not null, primary key
#  original_id(Id from the original table (inds / quals / quants)) :integer          not null
#  original_type(Type of the original entity (Ind / Qual / Quant)) :text             not null
#  name                                                            :text             not null
#  display_name                                                    :text
#  unit                                                            :text
#  unit_type                                                       :text
#  tooltip_text                                                    :text
#  tooltip_text_by_context_id                                      :jsonb
#  tooltip_text_by_country_id                                      :jsonb
#  tooltip_text_by_commodity_id                                    :jsonb
#  display_name_by_context_id                                      :jsonb
#  display_name_by_country_id                                      :jsonb
#  display_name_by_commodity_id                                    :jsonb
#
# Indexes
#
#  attributes_original_type_name_idx  (original_type,name) UNIQUE
#
# This class is not backed by a materialized view, but a table.
# The table is refreshed using Postgres "upsert" to preserve ids.
# The upsert is defined in a SQL function.
module Api
  module V3
    module Readonly
      class Attribute < Api::Readonly::BaseModel
        self.table_name = 'attributes'

        has_many :cont_attribute_sankey_card_links,
                 class_name: 'Api::V3::SankeyCardLink',
                 inverse_of: :cont_attribute
        has_many :ncont_attribute_sankey_card_links,
                 class_name: 'Api::V3::SankeyCardLink',
                 inverse_of: :ncont_attribute

        delegate :values_meta, to: :original_attribute

        class << self
          def select_options
            order(:display_name).map do |a|
              ["#{a.display_name} (#{a.name})", a.id]
            end
          end

          # @param options
          # @option options [Boolean] :skip_dependents skip refreshing
          def refresh_now(_options = {})
            upsert_attributes
          end

          # @param options
          # @option options [Boolean] :skip_dependents skip refreshing
          def refresh_later(options = {})
            UpsertAttributesWorker.perform_async(options)
          end

          def refresh_by_conditions(old_conditions, new_conditions, options)
            refresh_now
            refresh_nested_dependents(old_conditions, new_conditions, options)
          end

          def refresh_nested_dependents(old_conditions = nil, new_conditions = nil, options = {})
            dependent_classes = self.dependent_classes
            return if options[:skip_dependents]

            dependent_classes.each do |dependent_class|
              refreshed_tables = options[:refreshed_tables] || []
              next if refreshed_tables.include?(dependent_class.table_name)

              dependent_class.refresh_by_conditions(
                old_conditions, new_conditions, options.merge(refreshed_tables: refreshed_tables)
              )
            end
          end

          protected

          def upsert_attributes
            connection.execute('SELECT upsert_attributes()')
          end
        end

        def original_attribute
          "Api::V3::#{original_type}".constantize.find(original_id)
        end

        def node_values_meta_per_context(context)
          return unless values_meta.present?

          values_meta.node_values.dig('context', context.id.to_s)
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

        def temporal?(context)
          meta = node_values_meta_per_context(context)
          meta['years'].any?
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
