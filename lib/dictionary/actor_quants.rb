module Dictionary
  class ActorQuants < NodeAttributeValues
    def load_values(node, year)
      node.actor_quants + node.temporal_actor_quants(year)
    end
  end
end
