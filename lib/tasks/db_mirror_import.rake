namespace :db do
  namespace :mirror do
    desc "Restores data from S3 and imports from local schema"
    task import: :environment do
      unless ENV["SCHEMA_VERSION"].present?
        abort("Please provide database version as env var e.g. SCHEMA_VERSION=MAIN/trase_earth_20181128.dump.gz")
      end
      with_update_lock do |database_update|
        Api::V3::Import::MirrorImport.new.call(database_update, ENV["SCHEMA_VERSION"])
      end
    end
  end

  def with_update_lock
    database_update = Api::V3::DatabaseUpdate.new(status: Api::V3::DatabaseUpdate::STARTED)
    if database_update.save
      stats = yield(database_update)
      puts database_update.stats_to_s
    else
      puts "Database update already in progress."
    end
  end
end
