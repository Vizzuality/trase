desc 'Check for stuck QUEUED cnfiguration export jobs and give them a kick'
task unblock_jobs: :environment do
  Api::Private::ConfigurationExportEvent.where(jid: nil).each do |event|
    ConfigurationExportWorker.perform_async(event.id)
  end
end
