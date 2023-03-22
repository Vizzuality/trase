server "production-data.trase.earth", user: "ubuntu", roles: %w{web app db}, primary: true
server "production-web.trase.earth", user: "ubuntu", roles: %w{web app}, primary: false

set :branch, "master"

set :sitemap_roles, :db
after "deploy:finishing", "sitemap:refresh"
