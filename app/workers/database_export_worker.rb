class DatabaseExportWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 120, # 2 mins
                  log_duplicate_payload: true
  EXPORT_DIR = 'tmp/export'.freeze
  INSTANCE_NAME = ENV['INSTANCE_NAME']

  def perform
    work
  end

  def work
    filename = Time.now.strftime('%Y%m%d-%H:%M:%S%:z') + '.dump'
    local_filename = EXPORT_DIR + '/' + filename
    s3_filename = INSTANCE_NAME + '/' + filename
    dump(local_filename)
    upload_to_s3(s3_filename, local_filename)
    s3_filename
  ensure
    FileUtils.rm_f Dir.glob("#{EXPORT_DIR}/*") if dir_exists?
  end

  private

  def dump(local_filename)
    config = Rails.configuration.database_configuration
    env_config = config[Rails.env]
    pg_tasks = ActiveRecord::Tasks::PostgreSQLDatabaseTasks.new(env_config)
    FileUtils.mkdir_p(EXPORT_DIR) unless dir_exists?
    pg_tasks.data_dump(local_filename)
    Rails.logger.debug 'Database dumped'
  end

  def upload_to_s3(s3_filename, local_filename)
    Api::V3::S3Uploader.instance.call(
      s3_filename,
      local_filename,
      schema_version: ActiveRecord::Migrator.current_version.to_s
    )
    Rails.logger.debug 'Database uploaded'
  end

  def dir_exists?
    File.directory?(EXPORT_DIR)
  end
end
