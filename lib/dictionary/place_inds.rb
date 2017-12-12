module Dictionary
  class PlaceInds < NodeAttributeValues
    def load_values(node, year)
      node.place_inds + node.temporal_place_inds(year)
    end
  end
end
