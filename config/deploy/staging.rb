server '52.41.12.189', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, {
    forward_agent: true
}