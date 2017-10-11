server '35.161.156.173', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, {
    forward_agent: true
}

set :branch, 'develop'
set :rails_env, 'staging'
