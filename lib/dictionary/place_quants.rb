module Dictionary
  class PlaceQuants < NodeAttributeValues
    def load_values(node, year)
      node.place_quants + node.temporal_place_quants(year)
    end
  end
end
