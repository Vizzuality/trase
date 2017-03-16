# TRASE API

[![Build Status](https://travis-ci.org/Vizzuality/trase-api.svg?branch=master)](https://travis-ci.org/Vizzuality/trase-api)

API for the new [Trase](http://trase.earth) functionalities

## Requirements

This project uses:
- Ruby 2.4.0
- Rails 5.0
- PostgreSQL 9.x + `intarray` extension

## Deployment

We use Capistrano as a deployment tool. Refer to its documentation for more info

## Test

```
RAILS_ENV=test rake db:drop db:create db:structure:load
bundle exec rspec spec
```
