source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.4.4'
 # Use pg as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 5.2'
# Use SCSS for stylesheets
gem 'sassc-rails', '~> 2.1.2'
gem 'sprockets', '< 4'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 5.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.11'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'
# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

gem 'active_model_serializers', '~> 0.10.12'
gem 'activeadmin', '~> 1.4.3'
gem 'activeadmin_addons'
gem 'activeadmin_simplemde' # this depends on AA 1
gem 'activeadmin_sortable_table'
gem 'acts_as_list'
gem 'appsignal'
gem 'aws-sdk-s3', '~> 1'
gem 'best_in_place'
gem 'ckeditor', '4.3.0'
gem 'devise', '~> 4.7'
gem 'devise_token_auth'
gem 'dotenv-rails', '~> 2.7'
gem 'enumerate_it', '~> 3.2.0'
gem 'kaminari'
gem 'mailchimp-api', require: 'mailchimp'
# gem 'newrelic_rpm'
gem 'oj'
gem 'paperclip', '~> 6.1.0'
gem 'pg_csv'
gem 'pg_search'
gem 'rack', '~> 2.2.3' # issue with sidekiq web in version 2.1.1, still doesn't work on sandbox in version 2.1.2
gem 'rack-cors', '~> 1.1'
gem 'scenic'
gem 'sidekiq', '~> 6.1.3'
gem 'sidekiq-unique-jobs'
gem 'sitemap_generator'
gem 'staccato'
gem 'twitter', '~> 7.0'
gem 'zip_tricks'
gem 'whenever', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
  gem 'factory_bot_rails'
  gem 'json-schema'
  gem 'rails-controller-testing'
  gem 'rspec-collection_matchers'
  gem 'rspec-rails', '~> 4.0'
  gem 'rubocop-rspec'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.3.3'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'annotate'
  gem 'bcrypt_pbkdf', '~> 1.0'
  gem 'capistrano', '~> 3.16', require: false
  gem 'capistrano-bundler'
  gem 'capistrano-yarn'
  gem 'capistrano-nvm'
  gem 'capistrano-passenger'
  gem 'capistrano-rails', '~> 1.6', require: false
  gem 'capistrano-rvm'
  gem 'ed25519', '~> 1.2'
  gem 'rubocop', '~> 1.10.0', require: false
  gem 'rubocop-performance', require: false
end

# a note about ed25519 support
# from net-ssh readme https://github.com/net-ssh/net-ssh:
#{ }"For ed25519 public key auth support your bundle file should contain ed25519, bcrypt_pbkdf dependencies."
# those are development dependencies of net-ssh
# versions required by net-ssh can be looked up here: https://github.com/net-ssh/net-ssh/blob/master/net-ssh.gemspec

group :test do
  # Adds support for Capybara system testing and selenium driver
  # gem 'capybara', '>= 2.15'
  # gem 'selenium-webdriver'
  # Easy installation and use of chromedriver to run system tests with Chrome
  # gem 'chromedriver-helper'
  gem 'database_cleaner'
  gem 'simplecov', require: false
  gem 'webmock'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
