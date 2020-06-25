module Api
  module V3
    module Places
      class StateRanking
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param state_name [String]
        def initialize(context, node, year, state_name)
          @context = context
          @node = node
          @year = year
          @state_name = state_name
          @node_index = Api::V3::NodeType.node_index_for_id(
            @context, @node.node_type_id
          )
        end

        # Returns the node's ranking across all nodes of same type within given:
        # source country, year
        # for attribute (quant or ind)
        def position_for_attribute(
          attribute, include_domestic_consumption = true
        )
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = "node_#{attribute_type}s"

          query = basic_query(attribute, include_domestic_consumption).
            select(
              'nodes.id AS node_id',
              "DENSE_RANK() OVER (ORDER BY #{value_table}.value DESC) AS rank"
            ).where(
              "#{value_table}.year = ? OR #{value_table}.year IS NULL",
              @year
            )

          result = Node.from('(' + query.to_sql + ') s').
            select('s.*').
            where('s.node_id' => @node.id).
            order('rank ASC').
            first

          result && result['rank'] || nil
        end

        # Returns the average across all nodes of same type and all years
        # within given source country
        # for attribute (quant or ind)
        def average_for_attribute(
          attribute, include_domestic_consumption = true
        )
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = "node_#{attribute_type}s"
          # rubocop:disable Layout/LineLength
          query = basic_query(attribute, include_domestic_consumption).
            select(
              'nodes.id AS node_id',
              "AVG(#{value_table}.value) OVER (PARTITION BY #{value_table}.year) AS value",
              "#{value_table}.year"
            )
          # rubocop:enable Layout/LineLength

          Node.from('(' + query.to_sql + ') s').
            select('s.*').
            where('s.node_id' => @node.id).
            order(nil)
        end

        private

        def basic_query(
          attribute, include_domestic_consumption = true
        )
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = "node_#{attribute_type}s"

          query = Api::V3::Node.
            joins(:node_property, node_quals: :qual).
            joins(
              value_table => {attribute_type => "#{attribute_type}_property"}
            ).
            where(node_type_id: @node.node_type_id).
            where("#{value_table}.#{attribute_type}_id" => attribute.id).
            where('node_quals.value' => @state_name, 'quals.name' => 'STATE')
          unless include_domestic_consumption
            query = query.where('NOT is_domestic_consumption')
          end
          query
        end
      end
    end
  end
end
