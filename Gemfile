source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.3"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem "rails", "~> 6.1.7"
# Use pg as the database for Active Record
gem "pg"
# Use Puma as the app server
gem "puma", "~> 6.2"
# Use SCSS for stylesheets
gem "sass-rails", ">= 6"
# Use CoffeeScript for .coffee assets and views
gem "coffee-rails"
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker", "~> 5.0"
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem "turbolinks", "~> 5"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.4", require: false

gem "active_model_serializers"
gem "activeadmin"
gem "activeadmin_addons"
gem "activeadmin_simplemde"
gem "activeadmin_sortable_table"
gem "acts_as_list"
gem "appsignal"
gem "aws-sdk-s3"
gem "best_in_place", git: "https://github.com/mmotherwell/best_in_place" # for Rails 6.1
gem "ckeditor", "< 5"
gem "devise"
gem "devise_token_auth"
gem "dotenv-rails"
gem "enumerate_it"
gem "faraday", "< 3"
gem "i18n_data"
gem "kaminari"
gem "MailchimpMarketing"
# gem 'net-http' # https://github.com/ruby/net-imap/issues/16#issuecomment-803086765
gem "oj"
gem "kt-paperclip", "~> 7.1"
gem "pg_csv"
gem "pg_search"
gem "rack"
gem "rack-cors"
gem "scenic"
gem "sidekiq", "< 7"
gem "sidekiq-unique-jobs"
gem "sitemap_generator"
gem "staccato"
gem "twitter"
gem "zip_tricks"
gem "wet-health_endpoint"
gem "whenever", require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platform: :mri
  gem "factory_bot_rails"
  gem "json-schema"
  gem "rails-controller-testing"
  gem "rspec-collection_matchers"
  gem "rspec-rails"
  gem "standard", ">= 1.0"
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # gem 'web-console', '>= 4.1.0'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  # gem 'rack-mini-profiler', '~> 2.0'
  gem "listen", "~> 3.3"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.1.0"
  gem "annotate"
  gem "bcrypt_pbkdf"
  gem "capistrano", require: false
  gem "capistrano-bundler"
  gem "capistrano-yarn"
  gem "capistrano-nvm"
  gem "capistrano-passenger"
  gem "capistrano-rails", require: false
  gem "capistrano-rvm"
  # a note about ed25519 support
  # from net-ssh readme https://github.com/net-ssh/net-ssh:
  # { }"For ed25519 public key auth support your bundle file should contain ed25519, bcrypt_pbkdf dependencies."
  # those are development dependencies of net-ssh
  # versions required by net-ssh can be looked up here: https://github.com/net-ssh/net-ssh/blob/master/net-ssh.gemspec
  gem "ed25519"
  gem "rubocop", require: false
  gem "rubocop-performance", require: false
end

group :test do
  gem "database_cleaner"
  gem "simplecov", require: false
  gem "webmock"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
