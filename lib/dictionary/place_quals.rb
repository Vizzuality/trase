module Dictionary
  class PlaceQuals < NodeAttributeValues
    def load_values(node, year)
      node.place_quals + node.temporal_place_quals(year)
    end
  end
end
