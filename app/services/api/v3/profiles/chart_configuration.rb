module Api
  module V3
    module Profiles
      class ChartConfiguration
        attr_reader :chart,
                    :chart_attributes, :attributes,
                    :chart_node_types, :node_types

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param chart_options [Hash]
        # @option chart_options [Symbol] :profile_type
        # @option chart_options [Symbol] :parent_identifier
        # @option chart_options [Symbol] :identifier
        def initialize(context, node, chart_options)
          @context = context
          @node = node
          initialize_chart(
            chart_options[:profile_type],
            chart_options[:parent_identifier],
            chart_options[:identifier]
          )
          initialize_attributes
          initialize_node_types
        end

        def named_attribute(name)
          idx = @chart_attributes.index do |chart_attribute|
            chart_attribute.identifier == name
          end
          return nil unless idx

          @attributes[idx]
        end

        def named_chart_attribute(name)
          @chart_attributes.find do |chart_attribute|
            chart_attribute.identifier == name
          end
        end

        def named_node_types(name)
          result = []
          @chart_node_types.each.with_index do |chart_node_type, idx|
            result << @node_types[idx] if chart_node_type.identifier == name
          end
          result
        end

        def named_node_type(name)
          named_node_types(name).first
        end

        private

        # @param profile_type [Symbol] either :actor, :place or :country
        # @param parent_identifier [Symbol] parent chart identifier (or nil)
        # @param identifier [Symbol] chart identifier
        def initialize_chart(profile_type, parent_identifier, identifier)
          profile = @context.profiles.where(
            "context_node_types.node_type_id" => @node.node_type_id,
            name: profile_type
          ).first
          unless profile
            node_type = @node.node_type
            raise ActiveRecord::RecordNotFound.new(
              "Profile not configured: PROFILE: #{profile_type} NODE TYPE: #{node_type} #{@context.country_name} / #{@context.commodity_name}"
            )
          end
          charts = profile.charts.where(identifier: identifier)
          charts =
            if parent_identifier.present?
              charts.includes(:parent).
                where("parents_charts.identifier" => parent_identifier)
            else
              charts.where(parent_id: nil)
            end
          @chart = charts.first
          return if @chart.present?

          raise ActiveRecord::RecordNotFound.new(
            "Chart not configured: CHART: #{identifier} PROFILE: #{profile_type} NODE TYPE: #{node_type} #{@context.country_name} / #{@context.commodity_name}"
          )
        end

        def initialize_attributes
          chart_attributes = @chart.readonly_chart_attributes.order(:position)
          @attributes = chart_attributes.map(&:original_attribute)
          @chart_attributes =
            chart_attributes.reject.with_index do |_chart_attribute, idx|
              @attributes[idx].nil?
            end
        end

        def initialize_node_types
          chart_node_types = @chart.chart_node_types.includes(:node_type)
          @node_types = chart_node_types.map(&:node_type)
          @chart_node_types =
            chart_node_types.reject.with_index do |_chart_node_type, idx|
              @node_types[idx].nil?
            end
        end
      end
    end
  end
end
