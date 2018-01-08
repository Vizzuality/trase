module Dictionary
  class ActorQuals < NodeAttributeValues
    def load_values(node, year)
      node.actor_quals + node.temporal_actor_quals(year)
    end
  end
end
