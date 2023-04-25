server "sandbox-data.trase.earth", user: "ubuntu", roles: %w{web app db}, primary: true
server "sandbox-web.trase.earth", user: "ubuntu", roles: %w{web app}, primary: false

set :branch, "develop"
