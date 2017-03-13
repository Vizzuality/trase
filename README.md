# TRASE API

API for the new TRASE functionalities

## Requirements

This project uses:
- Ruby 2.4.0
- Rails 5.0
- PostgreSQL 9.x + `intarray` extension

## Deployment

We use Capistrano as a deployment tool.Refer to its documentation for more info

## Test

```
RAILS_ENV=test bundle exec rake db:schema:load
bundle exec rspec spec
```
