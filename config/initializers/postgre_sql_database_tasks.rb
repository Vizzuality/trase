# This is a monkey patch so that we can avoid dumping objects in the main schema
# such as the server, using mappings and foreign tables
# ActiveRecord has a configuration parameter to control dumping: config.active_record.dump_schemas
# However, that doesn't help us as we need finer control
# The changes here are:
# - using --exclude-table parameter to exclude foreign tables from the dump
# - regexp based find / replace to exclude CREATE SERVER and CREATE USER MAPPING

module ActiveRecord
  module Tasks # :nodoc:
    class PostgreSQLDatabaseTasks # :nodoc:
      def structure_dump(filename, extra_flags)
        puts "The monkeypatch located in #{__FILE__} should be removed when Rails supports excluding schemas from dump"
        set_psql_env

        search_path = \
          case ActiveRecord::Base.dump_schemas
          when :schema_search_path
            configuration["schema_search_path"]
          when :all
            nil
          when String
            ActiveRecord::Base.dump_schemas
          end

        args = [
          "-s", "-x", "-O", "-f",
          filename,
          "--exclude-table=#{ENV['TRASE_LOCAL_FDW_SCHEMA']}.*"
        ] # here custom pg_dump flag
        args.concat(Array(extra_flags)) if extra_flags
        unless search_path.blank?
          args += search_path.split(",").map do |part|
            "--schema=#{part.strip}"
          end
        end

        ignore_tables = ActiveRecord::SchemaDumper.ignore_tables
        if ignore_tables.any?
          args += ignore_tables.flat_map { |table| ["-T", table] }
        end

        args << configuration["database"]
        run_cmd("pg_dump", args, "dumping")
        remove_sql_header_comments(filename)
        File.open(filename, "a") { |f| f << "SET search_path TO #{connection.schema_search_path};\n\n" }

        # And now for the truly disappointing part
        # manually suppressing CREATE SERVER and CREATE USER MAPPING
        # which don't seem to be possible to keep outside the dump otherwise ;(

        puts "Suppressing CREATE SERVER and CREATE USER MAPPING in dump. Please run rake db:remote:init after restoring."

        dump = File.read(filename)
        new_dump = dump.sub(
          /^CREATE SERVER .+? OPTIONS \(.+?\);$/m,
          '-- suppressed CREATE SERVER'
        )
        new_dump = new_dump.sub(
          /^CREATE USER MAPPING .+? OPTIONS \(.+?\);$/m,
          '-- suppressed CREATE USER MAPPING'
        )
        File.open(filename, "w") { |file| file << new_dump }
      end

      def data_dump(filename)
        set_psql_env
        args = ['--no-owner', '-Fc', '-f', filename]
        args << configuration['database']
        run_cmd('pg_dump', args, 'dumping')
      end

      def data_restore(filename, restored_db_name)
        set_psql_env
        db_name = configuration['database']
        args = ['-c', '-n', 'public', '-n', 'content', '-d', restored_db_name, filename]
        run_cmd('pg_restore', args, 'restoring')
      end
    end
  end
end