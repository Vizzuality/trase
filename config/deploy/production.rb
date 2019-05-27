server 'trase.earth', user: 'ubuntu', roles: %w{web app db}, primary: true
set :ssh_options, forward_agent: true

# TODO: Change to sitemap:refresh to ping Google and Bing services once we are sure this works
after 'deploy:finishing', 'sitemap:create'
