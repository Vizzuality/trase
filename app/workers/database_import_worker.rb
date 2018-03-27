class DatabaseImportWorker
  include Sidekiq::Worker
  include CacheUtils
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 120, # 2 mins
                  log_duplicate_payload: true
  IMPORT_DIR = 'tmp/import'.freeze
  INSTANCE_NAME = ENV['INSTANCE_NAME']

  def perform(s3_filename, root_url)
    work(s3_filename, root_url)
  end

  def work(s3_filename, root_url)
    raise 'Invalid S3 object name' unless s3_filename.match?(/\w+\/.+\.dump/)
    filename = s3_filename.split('/').last
    FileUtils.mkdir_p(IMPORT_DIR) unless File.directory?(IMPORT_DIR)
    local_filename = IMPORT_DIR + '/' + filename

    download_from_s3(s3_filename, local_filename)

    backup_s3_filename = DatabaseExportWorker.new.work
    Rails.logger.debug "Database backed up #{backup_s3_filename}"

    restore(local_filename)

    clear_cache(root_url)
  ensure
    FileUtils.rm_f Dir.glob("#{IMPORT_DIR}/*") if dir_exists?
  end

  private

  def download_from_s3(s3_filename, local_filename)
    metadata = Api::V3::S3Downloader.instance.call(s3_filename, local_filename)
    Rails.logger.debug 'Database downloaded'
    schema_version = ActiveRecord::Migrator.current_version.to_s
    schema_match = (metadata['schema_version'] == schema_version)
    raise 'Incompatible schema version, cannot restore' unless schema_match
  end

  def restore(local_filename)
    config = Rails.configuration.database_configuration
    env_config = config[Rails.env]
    active_db_name = env_config['database']
    pg_tasks = ActiveRecord::Tasks::PostgreSQLDatabaseTasks.new(env_config)
    pg_tasks.data_restore(local_filename, active_db_name)
    Rails.logger.debug 'Database restored'
  end

  def clear_cache(root_url)
    clear_cache_for_regexp_with_uri('/api/v3/', root_url)
    clear_cache_for_regexp_with_uri('/content/', root_url)
    Dictionary::Ind.instance.reset
    Dictionary::Qual.instance.reset
    Dictionary::Quant.instance.reset
  end

  def dir_exists?
    File.directory?(IMPORT_DIR)
  end
end
