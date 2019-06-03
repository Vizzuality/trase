module Api
  module V3
    class TablePartitions
      def initialize(year)
        self.class.ensure_partitioned_tables_exist
        @year = year
      end

      def self.create
        ensure_partitioned_tables_exist
        Api::V3::BaseModel.transaction do
          drop
          drop_indexes

          # get all years
          years = Api::V3::Flow.select(:year).distinct.pluck(:year)
          # each year in separate table
          years.each do |year|
            new(year).create
          end

          create_indexes
        end
      end

      def self.drop
        sql = <<~SQL
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name ~ 'download_flows_\d+'
        SQL
        result = execute(sql)
        result.each do |row|
          execute "DROP TABLE #{row['table_name']}"
        end
      end

      INDEXES = [
        {columns: :year},
        {columns: :context_id},
        {columns: [:attribute_type, :attribute_id]},
        {columns: :path}
      ].freeze

      def self.create_indexes
        INDEXES.each do |index_properties|
          columns = index_properties[:columns]
          execute "CREATE INDEX IF NOT EXISTS #{index_name(columns)} ON download_flows (#{columns_to_string(columns, ',')})"
        end
      end

      def self.drop_indexes
        INDEXES.each do |index_properties|
          columns = index_properties[:columns]
          execute 'DROP INDEX IF EXISTS ' + index_name(columns)
        end
      end

      def self.columns_to_string(columns, separator)
        if columns.is_a? Array
          columns.join(separator)
        else
          columns.to_s
        end
      end

      def self.index_name(columns)
        index_name = 'download_flows_'
        index_name << columns_to_string(columns, '_')
        index_name << '_idx'
        index_name
      end

      def create
        create_partition_for_year('download_flows')
      end

      def self.ensure_partitioned_tables_exist
        partitioned_table_name = 'download_flows'
        unless ActiveRecord::Base.connection.table_exists? partitioned_table_name
          raise("#{partitioned_table_name} doesn't exist")
        end
      end

      def create_partition_for_year(table_name)
        partition_name = "#{table_name}_#{@year}"
        create_partition_table(table_name, partition_name)
        insert_download_flows(partition_name)
        attach_partition(table_name, partition_name, @year)
      end

      def create_partition_table(table_name, partition_name)
        self.class.execute(
          <<~SQL
            CREATE TABLE #{partition_name}
              (LIKE #{table_name} INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
          SQL
        )
      end

      def insert_download_flows(partition_name)
        self.class.execute(
          <<~SQL
            INSERT INTO #{partition_name}
            SELECT * FROM download_flows_v
            WHERE year = #{@year};
          SQL
        )
      end

      def attach_partition(table_name, partition_name, list)
        self.class.execute(
          <<~SQL
            ALTER TABLE #{table_name} ATTACH PARTITION #{partition_name}
              FOR VALUES IN (#{list});
          SQL
        )
      end

      def self.execute(sql)
        ActiveRecord::Base.connection.execute sql
      end
    end
  end
end
