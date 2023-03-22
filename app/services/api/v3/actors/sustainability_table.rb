module Api
  module V3
    module Actors
      class SustainabilityTable
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_name_and_tooltip do
          Api::V3::AttributeNameAndTooltip
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year

          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get("Volume")
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new "Quant Volume not found"
          end

          initialize_chart_config(:actor, nil, :actor_sustainability)
          unless @chart_config.attributes.any?
            raise ActiveRecord::RecordNotFound.new "No attributes found"
          end

          @source_node_types = @chart_config.named_node_types("source")
          unless @source_node_types.any?
            raise ActiveRecord::RecordNotFound.new(
              'Chart node type "source" not found'
            )
          end

          initialize_flow_stats_for_node
        end

        def call
          @source_node_types.map do |node_type|
            chart_node_type = @chart_config.chart_node_types.
              find { |nta| nta.node_type_id = node_type.id }
            sustainability_for_group(
              node_type,
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

        def sustainability_for_group(node_type, include_totals)
          node_type_name = node_type.name
          top_nodes = get_top_nodes(node_type)
          group_totals_hash = {}
          rows = top_nodes.map do |node|
            data_row(group_totals_hash, node_type, node)
          end
          if include_totals && !rows.empty?
            rows << totals_row(group_totals_hash)
          end
          profile = get_profile(node_type)
          {
            name: node_type_name.pluralize.upcase,
            profile: profile.present?,
            included_columns:
                [{name: node_type_name.humanize}] +
                  @chart_config.chart_attributes.map do |ro_chart_attribute|
                    name_and_tooltip = get_name_and_tooltip.call(
                      attribute: ro_chart_attribute.readonly_attribute,
                      context: @context,
                      defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(ro_chart_attribute.display_name, ro_chart_attribute.tooltip_text)
                    )
                    {
                      name: name_and_tooltip.display_name,
                      unit: ro_chart_attribute.unit,
                      tooltip: name_and_tooltip.tooltip_text
                    }
                  end,
            rows: rows
          }
        end

        def data_row(group_totals_hash, node_type, node)
          node_id = node["node_id"]
          attributes = @chart_config.attributes
          totals_per_attribute = @flow_stats.
            flow_values_totals_for_attributes_into(
              attributes,
              node_type,
              node_id
            )
          totals_hash = Hash[
            totals_per_attribute.map do |total|
              [total["name"], total["value"]]
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
                  value: node["name"]
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

        def get_top_nodes(node_type)
          top_nodes_list = Api::V3::Profiles::SingleContextTopNodesList.new(
            @context,
            node_type,
            @node,
            year_start: @year,
            year_end: @year
          )
          top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: false,
            limit: 10
          )
        end

        def get_profile(node_type)
          @context.context_node_types.
            includes(:profile).
            where(node_type_id: node_type.id).
            first.
            profile
        end
      end
    end
  end
end
