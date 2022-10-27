server 'staging.trase.earth', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, forward_agent: true
set :nvm_node, 'v16.13.2'
set :branch, 'develop'

