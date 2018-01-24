Sidekiq.configure_server do |config|
  # this is an error handler for sidekiq; it is used to ensure the job that failed
  # is marked as FAILED in the database_updates tables
  config.error_handlers << Proc.new do |e, ctx_hash|
    jid = ctx_hash[:job]['jid']
    du = Api::V3::DatabaseUpdate.where(jid: jid).first
    du&.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
  end
end
