CONTENT_DB = YAML.load(ERB.new(File.join(Rails.root, 'config', 'content_database.yml')).result)[Rails.env]
