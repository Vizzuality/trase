namespace :db do
  namespace :revamp do
    desc 'Refresh materialized views'
    task refresh: [:environment] do
      SchemaRevamp.new.refresh
    end

    desc 'Copy data from public schema into revamp schema'
    task copy: [:environment] do
      SchemaRevamp.new.copy
    end
  end
end
