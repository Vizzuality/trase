# This is a temporary mechanism that allows us to copy data between the content
# database and the content schema
class SchemaContent
  def copy
    initialize_fdw
    tables_to_copy.each do |table|
      copy_data(table)
    end
    cleanup_fdw
  end

  def initialize_fdw
    # temp schema just to copy from another db
    execute_local_query 'CREATE SCHEMA IF NOT EXISTS content_fdw'
    with_search_path('content_fdw') do
      server = 'content_server'
      create_server(
        server,
        ENV['POSTGRES_HOSTNAME'],
        ENV['POSTGRES_PORT'],
        ENV['POSTGRES_CONTENT_DATABASE']
      )
      create_user_mapping(
        server,
        ENV['POSTGRES_USERNAME'],
        ENV['POSTGRES_PASSWORD']
      )
      import_foreign_schema(server, 'public', 'content_fdw')
    end
  end

  def cleanup_fdw
    execute_local_query 'DROP SCHEMA content_fdw CASCADE'
    execute_local_query 'DROP SERVER content_server CASCADE'
  end

  def tables_to_copy
    %w[
      ckeditor_assets
      posts
      site_dives
      staff_groups
      staff_members
      testimonials
      users
    ]
  end

  def copy_data(table)
    Rails.logger.debug("Copying table #{table}...") unless Rails.env.test?
    truncate_table(table)
    affected_rows = ActiveRecord::Base.connection.execute(
      send("#{table}_insert_sql")
    ).cmd_tuples
    Rails.logger.debug "#{table}: #{affected_rows} affected rows"
    ActiveRecord::Base.connection.execute(
      "SELECT setval(pg_get_serial_sequence('content.#{table}', 'id'), coalesce(max(id),0) + 1, false) FROM content.#{table};"
    )
  end

  def truncate_table(table)
    ActiveRecord::Base.connection.execute(
      "TRUNCATE content.#{table} CASCADE"
    )
  end

  def ckeditor_assets_insert_sql
    simple_insert(
      'ckeditor_assets',
      %w(
        id
        data_file_name
        data_content_type
        data_file_size
        data_fingerprint
        assetable_id
        assetable_type
        type
        width
        height
        created_at
        updated_at
      )
    )
  end

  def posts_insert_sql
    simple_insert(
      'posts',
      %w(
        id
        title
        date
        post_url
        state
        highlighted
        category
        image_file_name
        image_content_type
        image_file_size
        image_updated_at
        created_at
        updated_at
      )
    )
  end

  def site_dives_insert_sql
    simple_insert(
      'site_dives',
      %w(
        id
        page_url
        description
        created_at
        updated_at
      )
    )
  end

  def staff_groups_insert_sql
    simple_insert(
      'staff_groups',
      %w(
        id
        name
        position
        created_at
        updated_at
      )
    )
  end

  def staff_members_insert_sql
    simple_insert(
      'staff_members',
      %w(
        id
        staff_group_id
        name
        position
        bio
        image_file_name
        image_content_type
        image_file_size
        image_updated_at
        created_at
        updated_at
      )
    )
  end

  def testimonials_insert_sql
    simple_insert(
      'testimonials',
      %w(
        id
        quote
        author_name
        author_title
        image_file_name
        image_content_type
        image_file_size
        image_updated_at
        created_at
        updated_at
      )
    )
  end

  def users_insert_sql
    simple_insert(
      'users',
      %w(
        id
        email
        encrypted_password
        reset_password_token
        reset_password_sent_at
        remember_created_at
        sign_in_count
        current_sign_in_at
        last_sign_in_at
        current_sign_in_ip
        last_sign_in_ip
        created_at
        updated_at
      )
    )
  end

  def simple_insert(table_name, column_names)
    <<-SQL
    INSERT INTO content.#{table_name} (#{column_names.join(', ')})
    SELECT #{column_names.join(', ')}
    FROM content_fdw.#{table_name};
    SQL
  end

  def create_server(server, host, port, database)
    # Define the foreign server
    query = <<~SQL
      CREATE SERVER #{server} FOREIGN DATA WRAPPER postgres_fdw
      OPTIONS (host '#{host}', port '#{port}', dbname '#{database}', updatable 'false');
    SQL
    execute_local_query(query)
  end

  def drop_server(server)
    query = "DROP SERVER IF EXISTS #{server} CASCADE"
    execute_local_query(query)
  end

  def create_user_mapping(server, username, password)
    # Create the user mapping (readonly user)
    query = <<~SQL
      CREATE USER MAPPING FOR CURRENT_USER SERVER #{server}
      OPTIONS (user '#{username}', password '#{password}');
    SQL
    execute_local_query(query)
  end

  def execute_local_query(query)
    puts query
    ActiveRecord::Base.connection.execute query
  end

  def import_foreign_schema(server, remote_schema, local_schema)
    query = <<~SQL
      IMPORT FOREIGN SCHEMA #{remote_schema} FROM SERVER #{server}
      INTO #{local_schema};
    SQL
    execute_local_query(query)
  end
end
