class ConfigurationExportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low

  def perform(event_id)
    event = Api::Private::ConfigurationExportEvent.find_by_id(event_id)
    return jid unless event.present?

    event.update_attribute(:jid, jid)
    Api::Private::Configuration::Exporter.new(event).call
  rescue => e
    event.fail!(e)
    Appsignal.send_error(e)
  ensure
    jid
  end
end
