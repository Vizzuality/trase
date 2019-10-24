server 'staging.trase.earth', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, forward_agent: true

set :nvm_type, :user
set :nvm_node, 'v12.12.0'
set :nvm_map_bins, %w{node npm yarn}

set :branch, 'develop'
