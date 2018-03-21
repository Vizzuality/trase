namespace :db do
  namespace :remote do
    task import: :environment do
      database_update = Api::V3::DatabaseUpdate.new(status: Api::V3::DatabaseUpdate::STARTED)
      if database_update.save
        stats = Api::V3::Import::Importer.new.call(database_update)
        puts database_update.stats_to_s
      else
        puts 'Database update already in progress.'
      end
    end
  end
end
