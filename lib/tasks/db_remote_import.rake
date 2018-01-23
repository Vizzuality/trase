namespace :db do
  namespace :remote do
    task import: :environment do
      with_search_path(ENV['TRASE_LOCAL_SCHEMA']) do
        stats = Api::V3::Import::Importer.new.call
        stats.each do |blue_table, blue_table_stats|
          puts "#{blue_table} before: #{blue_table_stats[:before]}, after: #{blue_table_stats[:after]} (remote: #{blue_table_stats[:remote]})"
          blue_table_stats[:yellow_tables]&.each do |yellow_table, yellow_table_stats|
            puts "#{yellow_table} before: #{yellow_table_stats[:before]}, after: #{yellow_table_stats[:after]}"
          end
        end
      end
    end
  end
end
