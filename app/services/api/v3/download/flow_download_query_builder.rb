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
          @query = Api::V3::Readonly::DownloadFlow.where(
            context_id: @context.id
          )
          if (years = params[:years]).present?
            @query = @query.where(year: years)
          end
          if (exporters_ids = params[:e_ids]).present?
            @query = @query.where(exporter_node_id: exporters_ids)
          end
          if (importers_ids = params[:i_ids]).present?
            @query = @query.where(importer_node_id: importers_ids)
          end
          if (countries_ids = params[:c_ids]).present?
            @query = @query.where(country_node_id: countries_ids)
          end
          return unless (filters = params[:filters]).present?

          apply_attribute_filters(filters)
        end

        def flat_query
          FlowDownloadFlatQuery.new(@context, @query)
        end

        def pivot_query
          FlowDownloadPivotQuery.new(@context, @query)
        end

        private

        def apply_attribute_filters(attributes_list)
          query_parts = []
          parameters = []

          attributes_list.each do |attr_hash|
            attribute = attribute_by_name(attr_hash[:name])
            next unless attribute

            attr_query_parts, attr_parameters = attribute_filter(
              attribute, *attr_hash.values_at(:op, :val)
            )
            query_parts << attr_query_parts.join(' AND ')
            parameters += attr_parameters
          end
          @query = @query.where(
            query_parts.join(' OR '), *parameters
          )
        end

        def attribute_by_name(name)
          return nil unless name

          Dictionary::Quant.instance.get(name) ||
            Dictionary::Qual.instance.get(name)
        end

        def attribute_filter(attribute, op_symbol, val)
          query_parts = ['attribute_type = ?', 'attribute_id = ?']
          parameters = [attribute.class.name.demodulize, attribute.id]
          op_part, val =
            if attribute.is_a? Api::V3::Qual
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

        def qual_op_part(op_symbol)
          op = QUAL_OPS[op_symbol]
          return nil unless op

          "LOWER(total) #{op} LOWER(?)"
        end

        def quant_op_part(op_symbol)
          op = QUANT_OPS[op_symbol]
          return nil unless op

          "sum #{op} ?"
        end
      end
    end
  end
end
