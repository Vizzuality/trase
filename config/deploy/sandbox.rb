server 'sandbox.trase.earth', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, forward_agent: true

set :nvm_type, :user
set :nvm_node, '12'
set :nvm_map_bins, %w{node npm yarn}

set :branch, 'develop'

