namespace :db do
  namespace :s3 do
    desc "Restore database from dump in S3 given by DATABASE_VERSION"
    task import: :environment do
      unless ENV["DATABASE_VERSION"].present?
        abort("Please provide database version as env var e.g. DATABASE_VERSION=AF DEV/20180329-13:20:49+02:00.dump")
      end
      Api::V3::DatabaseImport::Importer.new(ENV["DATABASE_VERSION"]).call
    end

    desc "Restore database from dump in S3 given by DATABASE_VERSION ignoring schema mismatch"
    task force_import: :environment do
      unless ENV["DATABASE_VERSION"].present?
        abort("Please provide database version as env var e.g. DATABASE_VERSION=AF DEV/20180329-13:20:49+02:00.dump")
      end
      Api::V3::DatabaseImport::Importer.new(ENV["DATABASE_VERSION"]).call(force: true)
    end

    task export: :environment do
      Api::V3::DatabaseExport::Exporter.new.call
    end
  end
end
