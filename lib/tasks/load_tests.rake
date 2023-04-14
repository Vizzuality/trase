namespace :load_tests do
  CONFIG_FILE_PATH = "#{Rails.root}/config/load_tests.yml".freeze
  SCRIPT_DIR = "#{Rails.root}/bin/load_tests/".freeze
  LOG_DIR = "#{Rails.root}/log/load_tests/".freeze
  URLS_FILE_NAME = "urls.txt".freeze

  desc "Generates url files per stage based on log file input given by RAILS_LOG_PATH"
  task :generate_urls_from_rails_log do
    # e.g. log/development.log
    input_path = ENV["RAILS_LOG_PATH"]
    unless input_path.present?
      abort("Please provide path to log file to seed the urls, e.g. RAILS_LOG_PATH=log/production.log")
    end
    ensure_directory_exists(SCRIPT_DIR)
    relative_urls_path = SCRIPT_DIR + URLS_FILE_NAME

    # generate relative urls file
    `cat #{input_path} | grep "Started GET \\"/api" | sed -E 's/.*Started GET "(.+)".+/\\1/' | sort | uniq > #{relative_urls_path}`

    # generate siege input files for each stage
    config = YAML.safe_load(File.open(CONFIG_FILE_PATH))
    config.each do |stage, options|
      next unless options["enabled"]

      stage_urls_path = stage_urls_path(stage)
      puts "Generating siege input file for #{stage} in #{stage_urls_path}"
      `cat #{relative_urls_path} | sed 's/^/#{options["host"].gsub("/", '\/')}/' > #{stage_urls_path}`
    end
  end

  desc "Runs load tests in requested stage given by LOAD_TESTS_STAGE; or run specified urls file LOAD_TESTS_URLS"
  task :run do
    input_file_path = ENV["LOAD_TESTS_URLS"]
    # e.g. sandbox
    stage = ENV["LOAD_TESTS_STAGE"]
    unless input_file_path.present? || stage.present?
      abort("Please provide either stage (LOAD_TESTS_STAGE) or urls file path (LOAD_TESTS_URLS)")
    end

    input_file_path ||= stage_urls_path(stage)

    abort("Urls file does not exist") unless File.exist?(input_file_path)

    ensure_directory_exists(LOG_DIR)

    output_file_path = stage_log_path(stage)
    puts "Starting siege with urls from #{input_file_path}"
    puts "Output logged to #{output_file_path}"
    # siege parameters specified in .siegerc
    `siege -R #{Rails.root}/.siegerc -f #{input_file_path} > #{output_file_path}`
  end

  def stage_urls_path(stage)
    SCRIPT_DIR + [stage, URLS_FILE_NAME].join("_")
  end

  def stage_log_path(stage = "custom")
    LOG_DIR +
      [stage, Time.now.strftime("%Y%m%d-%H:%M:%S%:z")].join("_") +
      ".csv"
  end

  def ensure_directory_exists(dir)
    return if File.directory?(dir)

    FileUtils.mkdir_p(dir)
  end
end
