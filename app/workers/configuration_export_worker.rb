class ConfigurationExportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low,
                  retry: false,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 120, # 2 mins
                  log_duplicate_payload: true

  def perform(event_id)
    event = Api::Private::ConfigurationExportEvent.find(event_id)
    Api::Private::Configuration::Exporter.new(event).call
  rescue ActiveRecord::RecordNotFound
    # no-op
  rescue => e
    event.fail!(e)
    Appsignal.send_error(e)
  end
end
