source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.1'
gem 'pg', '~> 0.18'
gem 'scenic'
gem 'pg_csv'
gem 'rubyzip'
gem 'puma', '~> 3.0'
gem 'dotenv-rails', '~> 2.2'
gem 'active_model_serializers', '~> 0.10.0'
gem 'enumerate_it', '~> 1.4.1'
gem 'mailchimp-api', require: 'mailchimp'
gem 'oj'

gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'

gem 'jquery-rails'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'
gem 'devise', '~> 4.2'
gem 'activeadmin', '~> 1.2.1'
gem 'inherited_resources', github: 'activeadmin/inherited_resources'

gem 'ckeditor', git: 'https://github.com/galetahub/ckeditor.git'
gem 'paperclip', '~> 5.0.0'

gem 'rack-cors', '~> 0.4'
gem 'twitter', '~> 6.1'

gem 'appsignal'
gem 'sidekiq'

group :development, :test do
  gem 'byebug', platform: :mri
  gem 'rspec-rails', '~> 3.5'
  gem 'rails-controller-testing'
  gem 'factory_bot_rails'
  gem 'json-schema'
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
  gem 'capistrano-npm'
  gem 'rubocop', require: false
end

group :test do
  gem 'simplecov', require: false
  gem 'database_cleaner'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
