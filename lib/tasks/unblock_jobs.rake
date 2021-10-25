desc 'Check for stuck QUEUED cnfiguration export jobs and give them a kick'
task unblock_jobs: :environment do
  Api::Private::ConfigurationExportEvent.queued.where(jid: nil).order(:created_at).each do |event|
    Api::Private::Configuration::Exporter.new(event).call
  end
end
