module Api
  module V3
    module Profiles
      module AttributesInitializer
        # @param chart [Api::V3::Chart]
        # returns 2 arrays with matching elements:
        # array of Api::V3::Readonly::ChartAttribute
        # array of Api::V3::Ind / Api::V3::Qual / Api::V3::Quant
        def initialize_attributes(chart)
          chart_attributes = chart.readonly_chart_attributes.order(:position)
          attributes = chart_attributes.map(&:original_attribute)
          chart_attributes =
            chart_attributes.reject.with_index do |_chart_attribute, idx|
              attributes[idx].nil?
            end
          [chart_attributes, attributes.compact]
        end

        # @param profile_type [Symbol] either :actor or :place
        # @param identifier [Symbol] chart identifier
        def initialize_chart(profile_type, parent_identifier, identifier)
          profile = @context.profiles.where(
            'context_node_types.node_type_id' => @node.node_type_id,
            name: profile_type
          ).first
          unless profile
            node_type = @node&.node_type&.name
            raise "Profile not configured: #{profile_type} for #{node_type}"
          end
          charts = profile.charts.where(identifier: identifier)
          if parent_identifier.present?
            charts = charts.includes(:parent).
              where('parents_charts.identifier' => parent_identifier)
          end
          chart = charts.first
          unless chart
            raise "Chart not configured: #{identifier} for #{profile_type}"
          end
          chart
        end
      end
    end
  end
end
