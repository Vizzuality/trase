DB_CONTENT = YAML::load(ERB.new(File.read(Rails.root.join('config', 'database_content.yml'))).result)[Rails.env]
