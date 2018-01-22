namespace :db do
  namespace :remote do
    connection_properties = {
      adapter: 'postgresql',
      host: ENV['TRASE_REMOTE_HOST'],
      username: ENV['TRASE_REMOTE_USER'],
      password: ENV['TRASE_REMOTE_PASSWORD'],
      database: ENV['TRASE_REMOTE_DATABASE'],
      schema_search_path: ENV['TRASE_REMOTE_SCHEMA']
    }

    task check_config: :environment do
      if connection_properties.except(:password).values.any?(&:blank?)
        puts 'Please ensure the required remote database connection properties are specified in .env'
        exit(1)
      end
    end

    task init: :check_config do
      with_search_path(ENV['TRASE_LOCAL_FDW_SCHEMA']) do
        server = ENV['TRASE_REMOTE_SERVER']
        create_server(
          server,
          connection_properties[:host],
          connection_properties[:port],
          connection_properties[:database]
        )
        create_user_mapping(server, connection_properties[:username])
        import_foreign_schema(server, ENV['TRASE_REMOTE_SCHEMA'], ENV['TRASE_LOCAL_FDW_SCHEMA'])
      end
    end

    task drop: :check_config do
      drop_server(ENV['TRASE_REMOTE_SERVER'])
    end

    task reinit: [:drop, :init]

    def create_server(server, host, port, database)
      # Define the foreign server
      query =<<-SQL
CREATE SERVER #{server} FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '#{host}', port '#{port}', dbname '#{database}');
      SQL
      execute_local_query(query)
    end

    def drop_server(server)
      query = "DROP SERVER IF EXISTS #{server} CASCADE"
      execute_local_query(query)
    end

    def create_user_mapping(server, username)
      # Create the user mapping (readonly user)
      query =<<-SQL
CREATE USER MAPPING FOR CURRENT_USER SERVER #{server}
OPTIONS (user '#{username}');
      SQL
      execute_local_query(query)
    end

    def execute_local_query(query)
      puts query
      ActiveRecord::Base.connection.execute query
    end

    def import_foreign_schema(server, remote_schema, local_schema)
      query = <<-SQL
IMPORT FOREIGN SCHEMA #{remote_schema} FROM SERVER #{server}
INTO #{local_schema};
      SQL
      execute_local_query(query)
    end
  end
end
