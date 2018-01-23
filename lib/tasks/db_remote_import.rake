namespace :db do
  namespace :remote do
    task import: :environment do
      database_update = Api::V3::DatabaseUpdate.new(status: Api::V3::DatabaseUpdate::STARTED)
      if database_update.save
        stats = Api::V3::Import::Importer.new.call(database_update)
        stats.each do |blue_table, blue_table_stats|
          puts "#{blue_table} before: #{blue_table_stats[:before]}, after: #{blue_table_stats[:after]} (remote: #{blue_table_stats[:remote]})"
          blue_table_stats[:yellow_tables]&.each do |yellow_table, yellow_table_stats|
            puts "#{yellow_table} before: #{yellow_table_stats[:before]}, after: #{yellow_table_stats[:after]}"
          end
        end
      else
        puts "Database update already in progress."
      end
    end
  end
end
