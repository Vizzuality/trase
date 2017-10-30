source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


gem 'rails', '~> 5.0.2'
gem 'pg', '~> 0.18'
# Scenic adds methods to ActiveRecord::Migration to create and manage database views in Rails.
gem 'scenic'
# Fast Ruby PG csv export. Uses pg function 'copy to csv'.
gem 'pg_csv'
gem 'rubyzip'
gem 'puma', '~> 3.0'

gem 'dotenv-rails', '~> 2.1'

gem 'active_model_serializers', '~> 0.10.0'
gem 'enumerate_it', '~> 1.4.1'
gem 'mailchimp-api', require: 'mailchimp'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
  gem 'json-diff'
  gem 'csv-diff'
end

group :development do
  gem 'annotate'

  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'capistrano', '3.7.1'
  gem 'capistrano-rails'
  gem 'capistrano-bundler'
  gem 'capistrano-rvm'
  gem 'capistrano-passenger'
end

group :development, :test do
  gem 'rspec-rails', '~> 3.5'
  gem 'rails-controller-testing'
  gem 'factory_girl_rails'
  gem 'json-schema'
end

group :test do
  gem 'simplecov', require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
