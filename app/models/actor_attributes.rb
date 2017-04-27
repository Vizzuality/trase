class ActorAttributes

  def initialize(context, node)
    @context = context
    @node = node
    @node_type = @node.node_type.node_type
    @data = {
      node_name: @node.name,
      summary: 'data missing',
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    @node.actor_quals.each do |q|
      @data[q['name']] = q['value']
    end
  end

  def result
    {
      data: @data
    }
  end
end
