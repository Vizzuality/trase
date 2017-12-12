module Dictionary
  class NodeAttributeValues
    def initialize(node, year)
      values = load_values(node, year)
      @dict = Hash[
        values.map { |value| [value['name'], value] }
      ]
    end

    def get(key)
      @dict[key]
    end
  end
end
