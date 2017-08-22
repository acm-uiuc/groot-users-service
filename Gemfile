# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.
# app.rb
source 'https://rubygems.org'

gem 'bundler'
gem 'rake'

gem 'foreigner'
gem 'sinatra'
gem 'sinatra-contrib'
gem 'sinatra-cross_origin', '~> 0.3.1'

gem 'data_mapper'
gem 'dm-constraints'
gem 'dm-core'
gem 'dm-migrations'
gem 'dm-mysql-adapter'
gem 'dm-noisy-failures', '~> 0.2.3'
gem 'dm-serializer'
gem 'dm-timestamps'
gem 'dm-validations'
gem 'json'

group :test do
  gem 'codeclimate-test-reporter', require: nil
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'faker'
  gem 'guard-rspec'
  gem 'rack-test'
  gem 'rspec'
  gem 'shoulda'
  gem 'webmock'
end

group :development, :test do
  gem 'better_errors' # Show an awesome console in the browser on error.
  gem 'binding_of_caller'
  gem 'pry'
  gem 'rest-client'
  gem 'shotgun' # Auto-reload sinatra app on change.
end
