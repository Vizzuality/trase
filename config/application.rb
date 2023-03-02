require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module TraseNewApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    config.autoloader = :zeitwerk

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    config.eager_load_paths << "#{Rails.root}/lib"

    config.action_mailer.default_url_options = {host: ENV['MAILER_HOST'] || URI.parse(ENV['API_HOST']).host}

    config.active_record.schema_format = :sql
    # do not dump partitions
    ActiveRecord::SchemaDumper.ignore_tables = [
      'download_flows_*',
      'partitioned_flows_*',
      'partitioned_flow_quants_*',
      'partitioned_flow_inds_*',
      'partitioned_flow_quals_*',
      'partitioned_denormalised_flow_quants_*',
      'partitioned_denormalised_flow_inds_*',
      'partitioned_denormalised_flow_quals_*'
    ]
  end
end
