# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.
# app.rb
require './app'
require 'rake'
require 'pry'

namespace :db do
  desc 'Migrate the database'
  task :migrate do
    puts 'Migrating database'
    DataMapper.auto_migrate!
  end

  desc 'Upgrade the database'
  task :upgrade do
    puts 'Upgrading the database'
    DataMapper.auto_upgrade!
  end

  desc 'Populate the database with dummy data'
  task :seed do
    DataMapper.auto_migrate!
    puts 'Seeding database'
    require './scripts/seed.rb'
  end

  desc 'Load the database with data from liquid'
  task :liquid do
    # Delete data and load from schema
    DataMapper.auto_migrate!
    require './scripts/liquid.rb'
  end
end

desc 'Start Pry with application environment loaded'
task :pry do
  exec 'pry -r./init.rb'
end

namespace :routes do
  desc 'Print all the routes'
  task :show do
    Sinatra::Application.routes.each_pair do |method, list|
      puts ":: #{method} ::"
      routes = []
      list.each do |item|
        source = item[0].source
        item[1].each do |s|
          source.sub!(/\(.+?\)/, ':' + s)
        end
        routes << source[2...-2]
      end
      puts routes.sort.join("\n")
      puts "\n"
    end
  end
end
