namespace :db do
  namespace :remote do
    task import: :environment do
      database_update = Api::V3::DatabaseUpdate.new(status: Api::V3::DatabaseUpdate::STARTED)
      if database_update.save
        begin
          ActiveRecord::Base.transaction do
            stats = Api::V3::Import::Importer.new.call(database_update)
          end
          database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FINISHED)
          stats.each do |blue_table, blue_table_stats|
            puts "#{blue_table} before: #{blue_table_stats[:before]}, after: #{blue_table_stats[:after]} (remote: #{blue_table_stats[:remote]})"
            blue_table_stats[:yellow_tables]&.each do |yellow_table, yellow_table_stats|
              puts "#{yellow_table} before: #{yellow_table_stats[:before]}, after: #{yellow_table_stats[:after]}"
            end
          end
        rescue => e
          database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
          database_update.update_attribute(:error, e.message)
          Rails.logger.error e.message
          Appsignal.send_error(e)
        end
      else
        puts 'Database update already in progress.'
      end
    end
  end
end
