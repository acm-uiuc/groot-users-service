# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.  
# 
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.
# app.rb
# encoding: UTF-8
require_relative '../models/user'

before do
    halt(401, Errors::VERIFY_GROOT) unless Auth.verify_session(env) || settings.unsecure    
end

get '/status' do
    ResponseFormat.message("OK")
end

get '/users' do
    # filter by approved, name?
end

get '/users/:user_id' do
    # get individual user info
end

get '/users/:user_id/is_member' do
    # unprotected route to determine if a user is a member
end

post '/users' do
    # From join page, create an unapproved user
end

post '/users/login' do
    # Talk to crowd, get data back, and create a user if we need to
end

put '/users/:user_id/paid' do
    # For marking a user as a paid (basically make them approved)

    # TODO initiate some sort of crowd script that adds them to the AD or w/e
end

post '/users/logout' do
    # Talk to crowd, clear session
end

delete '/users/:user_id' do
    # For deleting a bad user
end
