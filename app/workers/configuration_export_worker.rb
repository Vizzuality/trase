class ConfigurationExportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low

  def perform(event_id)
    event = Api::Private::ConfigurationExportEvent.find(event_id)
    event.update_attribute(:jid, self.jid)
    Api::Private::Configuration::Exporter.new(event).call
  rescue ActiveRecord::RecordNotFound
    # no-op
  rescue => e
    event.fail!(e)
    Appsignal.send_error(e)
  end
end
