Sidekiq.configure_server do |config|
  # this is an error handler for sidekiq; it is used to ensure the job that failed
  # is marked as FAILED in the database_updates tables
  config.error_handlers << Proc.new do |e, ctx_hash|
    return unless ctx_hash[:job] && ctx_hash[:job]['class'] =~ /.+DatabaseUpdateWorker/
    jid = ctx_hash[:job]['jid']
    du = Api::V3::DatabaseUpdate.where(jid: jid).first
    du&.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
  end

  config.death_handlers << ->(job, _ex) do
    SidekiqUniqueJobs::Digests.del(digest: job['unique_digest']) if job['unique_digest']
  end

  config.redis = {size: (config[:concurrency] + 5)}

  config.client_middleware do |chain|
    chain.add SidekiqUniqueJobs::Middleware::Client
  end

  config.server_middleware do |chain|
    chain.add SidekiqUniqueJobs::Middleware::Server
  end

  SidekiqUniqueJobs::Server.configure(config)
end

Sidekiq.configure_client do |config|
  config.redis = {size: config[:concurrency]}

  config.client_middleware do |chain|
    chain.add SidekiqUniqueJobs::Middleware::Client
  end
end

# about the size setting:
# https://github.com/mperham/sidekiq/wiki/Using-Redis#complete-control
# about logging:
# sidekiq no longer supports a logfile
# it will log to stdout in dev / test
# in other envs we need to redirect the log output in systemd intializers
# ExecStart=/bin/bash -lc 'bundle exec sidekiq -e staging -C config/sidekiq.yml 2>&1 >> /var/www/trase/current/log/sidekiq.log'
