server 'ec2-54-68-137-160.us-west-2.compute.amazonaws.com', user: 'ubuntu', roles: %w{web app db}, primary: true
server 'ec2-54-244-163-124.us-west-2.compute.amazonaws.com', user: 'ubuntu', roles: %w{web app}, primary: false

set :ssh_options, forward_agent: true

set :sitemap_roles, :db
after 'deploy:finishing', 'sitemap:refresh'
