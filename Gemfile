source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.2.3'
gem 'pg', '~> 0.18'
gem 'scenic'
gem 'pg_csv'
gem 'pg_search'
gem 'rubyzip'
gem 'puma', '~> 3.0'
gem 'dotenv-rails', '~> 2.2'
gem 'active_model_serializers', '~> 0.10.10'
gem 'kaminari'
gem 'enumerate_it', '~> 1.4.1'
gem 'mailchimp-api', require: 'mailchimp'
gem 'oj'

gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'

gem 'jquery-rails'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'
gem 'devise', '~> 4.7'
gem 'activeadmin', '~> 1.3.1'
gem 'activeadmin_simplemde'
gem 'inherited_resources', github: 'activeadmin/inherited_resources'
gem 'activeadmin_addons'
gem 'acts_as_list'
gem 'activeadmin_sortable_table'
gem 'best_in_place'

gem 'ckeditor', git: 'https://github.com/galetahub/ckeditor.git'
gem 'paperclip', '~> 6.1.0'
gem 'aws-sdk-s3', '~> 1'

gem 'rack-cors', '~> 0.4'
gem 'twitter', '~> 6.1'

gem 'appsignal'
gem 'newrelic_rpm'
gem 'sidekiq'
gem 'sidekiq-unique-jobs'
gem 'whenever', require: false
gem 'ransack'
gem 'bootsnap'
gem 'sitemap_generator'

group :development, :test do
  gem 'byebug', platform: :mri
  gem 'rspec-rails', '~> 3.8'
  gem 'rubocop-rspec'
  gem 'rails-controller-testing'
  gem 'rspec-collection_matchers'
  gem 'factory_bot_rails'
  gem 'json-schema'
end

group :development do
  gem 'annotate'

  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'capistrano-yarn'
  gem 'capistrano', '~> 3.11', require: false
  gem 'capistrano-rails', '~> 1.4', require: false
  gem 'capistrano-bundler'
  gem 'capistrano-rvm'
  gem 'capistrano-passenger'

  gem 'rubocop', '~> 0.74.0', require: false
  gem 'rubocop-performance', require: false
  gem 'rbnacl', '>= 3.2', '< 5.0'
  gem 'rbnacl-libsodium'
  gem 'bcrypt_pbkdf', '>= 1.0', '< 2.0'
end

group :test do
  gem 'simplecov', require: false
  gem 'database_cleaner'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
