module Dictionary
  class ActorInds < NodeAttributeValues
    def load_values(node, year)
      node.actor_inds + node.temporal_actor_inds(year)
    end
  end
end
