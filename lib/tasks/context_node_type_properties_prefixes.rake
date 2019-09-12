namespace :context_node_type_properties do
  desc 'Add default prefixed to existing context node type properties'
  task add_prefixes: :environment do
    [
      {keys: %w[MUNICIPALITY DEPARTMENT STATE BIOME], prefix: 'produced in'},
      {keys: %w[EXPORTER EXPORTER\ GROUP], prefix: 'exported by'},
      {keys: %w[IMPORTER IMPORTER\ GROUP], prefix: 'imported by'},
      {keys: %w[DISTRICT\ OF\ EXPORT PORT\ OF\ EXPORT PORT], prefix: 'exported from'},
      {keys: %w[PORT\ OF\ IMPORT], prefix: 'imported from'}
    ].each do |prefix|
      ActiveRecord::Base.connection.exec_query("
        UPDATE context_node_type_properties
        SET prefix = '#{prefix[:prefix]}'
        FROM context_node_types
        INNER JOIN node_types ON node_types.id = context_node_types.node_type_id
        WHERE context_node_types.id = context_node_type_properties.context_node_type_id AND
              node_types.name IN(#{prefix[:keys].map { |key| "'#{key}'" }.join(', ')})
      ")
    end
  end
end
