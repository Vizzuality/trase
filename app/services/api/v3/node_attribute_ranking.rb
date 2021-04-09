module Api
  module V3
    class NodeAttributeRanking
      # @param node [Api::V3::Readonly::NodeWithFlows]
      # @year [Integer]
      def initialize(node, year)
        @node = node
        @year = year
      end

      # Returns the node's ranking across all nodes of same type in given year
      # for attribute (quant or ind)
      def call(attribute)
        query = query(attribute)
        result = query.model.from('(' + query.to_sql + ') s').
          select('s.*').
          where('s.node_id' => @node.id).
          order('rank ASC').
          first
        result && result['rank'] || nil
      end

      def query(attribute)
        attribute_type = attribute.class.name.demodulize.downcase
        value_class = ('Api::V3::' + "node_#{attribute_type}".camelize).constantize

        value_class.
          joins(node: :node_property).
          select("year, #{value_class.table_name}.node_id, value, ROW_NUMBER() OVER (ORDER BY value DESC) AS rank").
          where('year IS NULL OR year = ?', @year).
          where('NOT node_properties.is_domestic_consumption').
          where('NOT is_unknown').
          where(
            "#{attribute_type}_id" => attribute.id,
            'nodes.node_type_id' => @node.node_type_id
          )
      end
    end
  end
end
