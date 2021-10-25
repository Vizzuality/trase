module ActiveRecord
  module Tasks # :nodoc:
    class PostgreSQLDatabaseTasks # :nodoc:
      def data_dump(filename)
        set_psql_env
        db_name = configuration['database']
        cmd = "pg_dump --no-owner -c #{db_name} | gzip > #{filename}"
        run_cmd(cmd, [], 'dumping')
      end

      def data_restore(filename, restored_db_name)
        set_psql_env
        cmd = "gunzip -c #{filename} | psql #{restored_db_name}"
        run_cmd(cmd, [], 'restoring')
      end
    end
  end
end
