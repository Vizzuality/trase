# config valid for current version and patch releases of Capistrano
lock '~> 3.11.0'

set :application, 'trase'
set :repo_url, 'git@github.com:Vizzuality/trase.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/trase'

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, '.env', 'frontend/.env', 'frontend/dist/robots.txt'

# Default value for linked_dirs is []
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system', 'public/downloads', 'vendor/bundle'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

set :yarn_target_path, -> { release_path.join('frontend') } # default not set
set :yarn_flags, ''

set :init_system, :systemd

namespace :deploy do
  after :finishing, 'deploy:cleanup'
  after 'deploy:publishing', 'deploy:restart'
end

namespace :sidekiq do
  task :quiet do
    on roles(:db) do
      puts capture("pgrep -f 'sidekiq' | xargs kill -TSTP")
    end
  end
  task :restart do
    on roles(:db) do
      execute :sudo, :systemctl, :restart, :sidekiq
    end
  end
end

after 'deploy:starting', 'sidekiq:quiet'
after 'deploy:reverted', 'sidekiq:restart'
after 'deploy:published', 'sidekiq:restart'
after 'sidekiq:restart', 'downloads:refresh'
after 'deploy:updated', 'newrelic:notice_deployment'

namespace :yarn do
  after 'yarn:install', 'yarn:build'

  task :build do
    on roles fetch(:yarn_roles) do
      within fetch(:yarn_target_path, release_path) do
        with fetch(:yarn_env_variables, {}) do
          execute :yarn, 'build'
        end
      end
    end
  end
end

namespace :downloads do
  desc 'Clear pre-computed bulk downloads'
  task :clear do
    on roles(:db) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'downloads:clear'
        end
      end
    end
  end
  desc 'Refresh pre-computed bulk downloads in a background job'
  task :refresh do
    on roles(:db) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'downloads:refresh_later'
        end
      end
    end
  end
end

set :rvm_ruby_version, '2.6.3'
set :nvm_type, :user
set :nvm_node, 'v12.13.0'
set :nvm_map_bins, %w{node npm yarn}
