module Api
  module V3
    module Download
      class FlowDownloadQueryBuilder
        QUAL_OPS = {
          'eq' => '='
        }.freeze
        QUANT_OPS = QUAL_OPS.merge(
          'lt' => '<',
          'gt' => '>'
        ).freeze

        # @param context [Api::V3::Context]
        # @param params [Hash]
        # @option params [Array<Integer>] :years
        # @option params [Array<Integer>] :e_ids exporters ids
        # @option params [Array<Integer>] :i_ids importers ids
        # @option params [Array<Integer>] :c_ids countries ids
        # @option params [Array<Hash>] :filters advanced attribute filters
        #   e.g. [{"name"=>"ZERO_DEFORESTATION", "op"=>"eq", "val"=>"no"}]
        def initialize(context, params)
          @context = context
          initialize_query
          initialize_size_query
          if (years = params[:years]).present?
            @query = @query.where(year: years)
            @size_query = @size_query.where(year: years)
          end
          initialize_flow_path_filters(params.slice(:e_ids, :i_ids, :c_ids))
          initialize_attribute_filters(params[:filters])
        end

        def flat_query
          FlowDownloadFlatQuery.new(@context, @download_attributes, @query, @size_query)
        end

        def pivot_query
          FlowDownloadPivotQuery.new(@context, @download_attributes, @query, @size_query)
        end

        private

        def initialize_query
          @query = Api::V3::Flow.
            from('download_flows_v flows').
            joins(
              'JOIN download_attributes_mv ON
              download_attributes_mv.context_id = flows.context_id
              AND download_attributes_mv.original_type = flows.attribute_type
              AND download_attributes_mv.original_id = flows.attribute_id'
            ).where(context_id: @context.id)
        end

        def initialize_size_query
          @size_query = Api::V3::Readonly::DownloadFlowsStats.
            where(context_id: @context.id)
        end

        # rubocop:disable Metrics/MethodLength
        def initialize_flow_path_filters(params)
          if (exporters_ids = params[:e_ids]).present?
            apply_flow_path_filter(
              Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE,
              exporters_ids
            )
          end
          if (importers_ids = params[:i_ids]).present?
            apply_flow_path_filter(
              Api::V3::ContextNodeTypeProperty::IMPORTER_ROLE,
              importers_ids
            )
          end
          if (countries_ids = params[:c_ids]).present?
            apply_flow_path_filter(
              Api::V3::ContextNodeTypeProperty::DESTINATION_ROLE,
              countries_ids
            )
          end
        end
        # rubocop:enable Metrics/MethodLength

        def initialize_attribute_filters(params)
          @download_attributes = Api::V3::Readonly::DownloadAttribute.
            where(context_id: @context.id)

          apply_attribute_filters(params) if params.present?

          return unless defined? @attributes

          @download_attributes = @download_attributes.where(
            'attribute_id' => @attributes.map(&:id)
          )
        end

        # rubocop:disable Metrics/MethodLength
        def context_node_types_by_role
          if defined? @context_node_types_by_role
            return @context_node_types_by_role
          end
          context_node_types_with_roles = @context.context_node_types.
            includes(:context_node_type_property)
          roles = context_node_types_with_roles.map do |cnt|
            cnt.context_node_type_property&.role
          end.compact.uniq
          @context_node_types_by_role = Hash[
            roles.map do |role|
              [
                role,
                context_node_types_with_roles.select do |cnt|
                  cnt.context_node_type_property&.role == role
                end
              ]
            end
          ]
        end
        # rubocop:enable Metrics/MethodLength

        def apply_flow_path_filter(role, node_ids)
          role_node_types = context_node_types_by_role[role]
          return unless role_node_types.any?

          role_indexes = role_node_types.map(&:column_position)
          conds = []
          role_indexes.each do |idx|
            conds << "path[#{idx + 1}] IN (:node_ids)"
          end
          @query = @query.where(
            conds.join(' OR '), node_ids: node_ids.map(&:to_i)
          )
        end

        # rubocop:disable Metrics/MethodLength
        def apply_attribute_filters(attributes_list)
          @attributes = []
          query_parts = []
          parameters = []

          attributes_list.each do |attr_hash|
            attribute = attribute_by_name(attr_hash[:name])
            next unless attribute

            @attributes << attribute
            attr_query_parts, attr_parameters = attribute_filter(
              attribute, *attr_hash.values_at(:op, :val)
            )
            query_parts << attr_query_parts.join(' AND ')
            parameters += attr_parameters
          end

          @query = @query.where(
            query_parts.join(' OR '), *parameters
          )
          if @attributes.any?
            query_parts = []
            parameters = []
            @attributes.each do |attribute|
              query_parts << 'attribute_type = ? AND attribute_id = ?'
              parameters += [attribute.original_type, attribute.original_id]
            end
            @size_query = @size_query.where(
              [query_parts.join(' OR '), *parameters]
            )
          end
        end
        # rubocop:enable Metrics/MethodLength

        def attribute_by_name(name)
          return nil unless name

          Api::V3::Readonly::Attribute.find_by_name(name)
        end

        # rubocop:disable Metrics/MethodLength
        def attribute_filter(attribute, op_symbol, val)
          query_parts = ['download_attributes_mv.attribute_id = ?']
          parameters = [attribute.id]
          op_part, val =
            if attribute.original_type == 'Qual'
              [qual_op_part(op_symbol), val]
            else
              [quant_op_part(op_symbol), val&.to_f]
            end
          if op_part && val
            query_parts << op_part
            parameters << val
          end
          [query_parts, parameters]
        end
        # rubocop:enable Metrics/MethodLength

        def qual_op_part(op_symbol)
          op = QUAL_OPS[op_symbol]
          return nil unless op

          "LOWER(qual_value) #{op} LOWER(?)"
        end

        def quant_op_part(op_symbol)
          op = QUANT_OPS[op_symbol]
          return nil unless op

          "quant_value #{op} ?"
        end
      end
    end
  end
end
