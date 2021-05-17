module Api
  module V3
    class NodeAttributeValuesPreloader
      ORIGINAL_TYPES = %w(ind qual quant).freeze
      AttributeValue = Struct.new(:value, :year)

      def initialize(node, year)
        @node = node
        @year = year
        @values = Hash.new(ORIGINAL_TYPES.dup)
        @lazy_loaded = Set.new
      end

      # returns AttributeValue
      def get(original_type, original_id)
        return nil unless ORIGINAL_TYPES.include?(original_type)

        lazy_load(original_type)
        @values[original_type][original_id]
      end

      private

      def lazy_load(original_type)
        return if @lazy_loaded.include?(original_type)

        attribute_values_rel = send(:"preload_#{original_type}_values")
        attributes_values_hash = Hash[
          attribute_values_rel.map do |attribute_value|
            [attribute_value['original_id'], AttributeValue.new(attribute_value.value, attribute_value.year)]
          end
        ]

        @values[original_type] = attributes_values_hash
        @lazy_loaded.add(original_type)
      end

      def preload_ind_values
        @node.node_inds.select(['ind_id AS original_id', :value, :year]).
          where('year = ? OR year IS NULL', @year)
      end

      def preload_qual_values
        @node.node_quals.select(['qual_id AS original_id', :value, :year]).
          where('year = ? OR year IS NULL', @year)
      end

      def preload_quant_values
        @node.node_quants.select(['quant_id AS original_id', :value, :year]).
          where('year = ? OR year IS NULL', @year)
      end
    end
  end
end
