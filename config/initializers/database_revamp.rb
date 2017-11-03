DB_REVAMP = YAML::load(ERB.new(File.read(Rails.root.join('config', 'database_revamp.yml'))).result)[Rails.env]
