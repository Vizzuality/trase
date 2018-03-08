server 'staging.trase.earth', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, forward_agent: true

append :linked_files, 'frontend/dist/robots.txt'

set :branch, 'develop'
