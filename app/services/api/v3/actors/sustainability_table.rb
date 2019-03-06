module Api
  module V3
    module Actors
      class SustainabilityTable
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year

          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?

          initialize_chart_config(:actor, nil, :actor_sustainability_table)
          raise 'No attributes found' unless @chart_config.attributes.any?

          @source_node_types = @chart_config.named_node_types('source')
          unless @source_node_types.any?
            raise 'Chart node type "source" not found'
          end

          initialize_flow_stats_for_node
        end

        def call
          @source_node_types.map do |node_type|
            node_type_name = node_type.name
            chart_node_type = @chart_config.chart_node_types.
              find { |nta| nta.node_type_id = node_type.id }
            sustainability_for_group(
              node_type_name.pluralize.upcase,
              node_type_name,
              chart_node_type&.is_total
            )
          end
        end

        private

        def initialize_flow_stats_for_node
          @flow_stats = Api::V3::Profiles::FlowStatsForNode.new(
            @context, @year, @node
          )
        end

        def sustainability_for_group(name, node_type, include_totals)
          top_nodes_list = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: node_type
          )
          top_nodes = top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: false,
            limit: 10
          )
          group_totals_hash = {}
          rows = top_nodes.map do |node|
            data_row(group_totals_hash, node_type, node)
          end
          if include_totals && !rows.empty?
            rows << totals_row(group_totals_hash)
          end
          profile = @context.context_node_types.
            joins(:node_type).
            includes(:profile).
            where('node_types.name' => node_type).
            first.
            profile
          {
            name: name,
            profile: profile.present?,
            included_columns:
                [{name: node_type.humanize}] +
                  @chart_config.chart_attributes.map do |ro_chart_attribute|
                    {
                      name: ro_chart_attribute.display_name,
                      unit: ro_chart_attribute.unit,
                      tooltip: get_tooltip.call(
                        ro_chart_attribute: ro_chart_attribute,
                        context: @context
                      )
                    }
                  end,
            rows: rows
          }
        end

        def data_row(group_totals_hash, node_type, node)
          node_id = node['node_id']
          attributes = @chart_config.attributes
          totals_per_attribute = @flow_stats.
            flow_values_totals_for_attributes_into(
              attributes,
              node_type,
              node_id
            )
          totals_hash = Hash[
            totals_per_attribute.map do |total|
              [total['name'], total['value']]
            end
          ]
          totals_hash.each do |key, value|
            if group_totals_hash[key]
              group_totals_hash[key] += value
            else
              group_totals_hash[key] = value
            end
          end
          {
            values:
              [
                {
                  id: node_id,
                  value: node['name']
                }
              ] +
                attributes.map do |attribute|
                  attribute_total = totals_hash[attribute.name]
                  {value: attribute_total} if attribute_total
                end
          }
        end

        def totals_row(group_totals_hash)
          {
            is_total: true,
            values:
              @chart_config.attributes.map do |attribute|
                attribute_total = group_totals_hash[attribute.name]
                {value: attribute_total} if attribute_total
              end
          }
        end
      end
    end
  end
end
