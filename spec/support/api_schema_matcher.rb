RSpec::Matchers.define :match_response_schema do |schema|
  match do |response|
    schema_directory = "#{Dir.pwd}/spec/support/schemas"
    schema_path = "#{schema_directory}/#{schema}.json"
    schema_content = File.read(schema_path)
    JSON::Validator.validate!(schema_content, response.body, strict: false)
  end
end
