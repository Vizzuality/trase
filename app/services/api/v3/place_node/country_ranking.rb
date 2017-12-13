module Api
  module V3
    module PlaceNode
      class CountryRanking
        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @node_index = Api::V3::NodeType.node_index_for_id(@context, @node.node_type_id)
        end

        # Returns the node's ranking across all nodes of same type within given:
        # source country, year
        # for attribute (quant or ind)
        def position_for_attribute(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          value_table, dict_table = value_and_dict_tables(attribute_type)

          flows_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['JOIN flows ON nodes.id = flows.path[?]', @node_index]
          )
          query = Node.
            select(
              'nodes.id AS node_id',
              "DENSE_RANK() OVER (ORDER BY #{value_table}.value DESC) AS rank"
            ).
            where(node_type_id: @node.node_type_id).
            joins(flows_join_clause).
            where('flows.context_id' => @context.id).
            joins(value_table => {attribute_type => "#{attribute_type}_property"}).
            where("#{dict_table}.name" => attribute.name).
            where(
              "#{value_table}.year = ? OR NOT COALESCE(#{attribute_type}_properties.is_temporal_on_place_profile, FALSE)",
              @year
            ).
            joins(:node_property).
            where('NOT is_domestic_consumption').
            distinct

          result = Node.from('(' + query.to_sql + ') s').
            select('s.*').
            where('s.node_id' => @node.id).
            order('rank ASC').
            first

          result && result['rank'] || nil # TODO
        end

        private

        def value_and_dict_tables(attribute_type)
          if attribute_type == 'quant'
            %w[node_quants quants]
          elsif attribute_type == 'ind'
            %w[node_inds inds]
          end
        end
      end
    end
  end
end
