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
require_relative '../jobs/active_directory'
require_relative '../jobs/email'
require 'sucker_punch/testing/inline'

get '/users/status' do
  ResponseFormat.message('OK')
end

get '/users' do
  halt(401, Errors::VERIFY_GROOT) unless Sinatra::Application.unsecure || Auth.verify_session(env)
  halt 401, Errors::VERIFY_CREDS unless Sinatra::Application.unsecure || Auth.verify_admin(env)

  users = User.all(order: [:is_member.asc, :created_at.desc])
  ResponseFormat.data(users)
end

get '/users/:netid' do
  halt(401, Errors::VERIFY_GROOT) unless Sinatra::Application.unsecure || Auth.verify_session(env)
  halt 401, Errors::VERIFY_CREDS unless Sinatra::Application.unsecure || Auth.verify_admin(env)

  user = User.get(params[:netid]) || halt(404, Errors::USER_NOT_FOUND)
  ResponseFormat.data(user)
end

get '/users/:netid/is_member' do
  user = User.first(netid: params[:netid]) || halt(404, Errors::USER_NOT_FOUND)

  response = JSON.parse(ResponseFormat.message(''))
  response['data'] = {
    netid: user.netid,
    first_name: user.first_name,
    last_name: user.last_name,
    is_member: user.is_member
  }
  response.to_json
end

post '/users' do
  # From join page, create an unapproved user
  params = ResponseFormat.get_params(request.body.read)

  status, error = User.validate(params, %i[first_name last_name netid uin])
  halt status, ResponseFormat.error(error) if error

  halt 400, ResponseFormat.error('User already exists') if User.first(netid: params[:netid])

  user = User.create(
    first_name: params[:first_name],
    last_name: params[:last_name],
    netid: params[:netid],
    uin: params[:uin],
    is_member: false
  )
  halt 400, ResponseFormat.error('Error with UIN') if user.errors.any?

  EmailNotificationJob.perform_async(
    "#{params[:netid]}@illinois.edu",
    'Welcome to ACM@UIUC!',
    erb(:new_member_welcome, locals: { first_name: params[:first_name], netid: params[:netid] })
  )

  ResponseFormat.message 'Your request to join ACM was successful.'
end

post '/users/login' do
  params = ResponseFormat.get_params(request.body.read)

  status, error = User.validate(params, %i[netid password])
  halt status, ResponseFormat.error(error) if error

  result = Auth.verify_login(params[:netid], params[:password])
  halt 400, ResponseFormat.error('Invalid netid or password') unless result

  session_token = result['token']
  netid = result['user']['name']

  user = User.first(netid: netid)
  unless user
    # Fetch user info, fill in what we can, and then return with token
    # Should be mostly for development, where we don't have real user data
    user_data = Auth.get_user_info(session_token)

    user = User.create(
      netid: netid,
      first_name: user_data['user']['first-name'],
      last_name: user_data['user']['last-name'],
      is_member: true # must be an ACM user to have gotten here
    )
  end
  response = JSON.parse(ResponseFormat.data(user))
  response['data']['token'] = session_token

  response.to_json
end

put '/users/:netid/paid' do
  halt 401, Errors::VERIFY_GROOT unless Sinatra::Application.unsecure || Auth.verify_session(env)
  halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env)

  user = User.first(netid: params[:netid])
  halt 404, ResponseFormat.error('User not found') unless user
  halt 400, ResponseFormat.error('User is already a member') if user.is_member

  user.update(is_member: true) || halt(500, ResponseFormat.error('Error updating user.'))

  # Create an async task to add the user to the ACM Active Directory
  ActiveDirectoryJob.perform_async(user.netid)

  EmailNotificationJob.perform_async(
    "#{params[:netid]}@illinois.edu",
    'Thanks for your membership payment for ACM@UIUC',
    erb(:membership_payment_confirmation, locals: { first_name: user.first_name })
  )

  ResponseFormat.data(User.all(order: [:is_member.asc, :created_at.desc]))
end

# TODO: not used by UI - I guess not needed?
post '/users/logout' do
  halt(401, Errors::VERIFY_GROOT) unless Sinatra::Application.unsecure || Auth.verify_session(env)
  params = ResponseFormat.get_params(request.body.read)

  status, error = User.validate(params, [:token])
  halt status, ResponseFormat.error(error) if error

  Auth.logout(params[:token])

  ResponseFormat.message('OK')
end

delete '/users/:netid' do
  halt 401, Errors::VERIFY_GROOT unless Sinatra::Application.unsecure || Auth.verify_session(env)
  halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env)

  user = User.first(netid: params[:netid])
  halt 404, Errors::USER_NOT_FOUND unless user

  user.destroy
  ResponseFormat.data(User.all(order: [:is_member.asc, :created_at.desc]))
end
