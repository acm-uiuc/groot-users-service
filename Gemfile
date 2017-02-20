# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.  
# 
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.
# app.rb
source "https://rubygems.org"

gem 'bundler'
gem 'rake'

gem 'sinatra'
gem 'sinatra-contrib'
gem "sinatra-cross_origin", "~> 0.3.1"
gem 'foreigner'

gem 'json'
gem 'data_mapper'
gem 'dm-migrations'
gem 'dm-core'
gem 'dm-timestamps'
gem 'dm-mysql-adapter'
gem 'dm-constraints'
gem 'dm-serializer'
gem 'dm-validations'
gem 'dm-noisy-failures', '~> 0.2.3'

group :test do
  gem "codeclimate-test-reporter", require: nil
  gem 'rspec'
  gem 'rack-test'
  gem 'factory_girl'
  gem 'guard-rspec'
  gem 'faker'
  gem 'shoulda'
  gem 'database_cleaner'
  gem 'webmock'
end

group :development, :test do
  gem 'pry'
  gem 'shotgun' # Auto-reload sinatra app on change.
  gem 'better_errors' # Show an awesome console in the browser on error.
  gem 'rest-client'
  gem 'binding_of_caller'
end
