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
    halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env) || settings.unsecure
    
    users = User.all(order: [ :paid.asc, :created_at.desc ])
    ResponseFormat.success(users)
end

get '/users/:id' do
    halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env) || settings.unsecure

    user = User.get(params[:id]) || halt(404, Errors::USER_NOT_FOUND)
    ResponseFormat.data(user)
end

get '/users/:netid/is_member' do
    user = User.first(netid: params[:netid]) || halt(404, Errors::USER_NOT_FOUND)
    
    response = JSON.parse(ResponseFormat.message "")
    response['data'] = {
        netid: user.netid,
        first_name: user.first_name,
        last_name: user.last_name,
        is_member: user.paid
    }
    response.to_json
end

post '/users' do
    # From join page, create an unapproved user
    params = ResponseFormat.get_params(request.body.read)

    status, error = User.validate(params, [:first_name, :last_name, :netid, :uin])
    halt status, ResponseFormat.error(error) if error

    halt 400, ResponseFormat.error("User already exists") if User.first(netid: params[:netid])

    user = User.create(
        first_name: params[:first_name],
        last_name: params[:last_name],
        netid: params[:netid],
        uin: params[:uin],
        paid: false
    )

    ResponseFormat.message "User successfully added"
end

post '/users/login' do
    # Talk to crowd, get data back, and create a user if we need to, which would avoid the need for a nightly AD script
    params = ResponseFormat.get_params(request.body.read)
    
    status, error = User.validate(params, [:netid, :password])
    halt status, ResponseFormat.error(error) if error

    result = Auth.verify_login(params[:netid], params[:password])
    halt 400, ResponseFormat.error("Invalid netid or password") unless result
    
    session_token = result["token"]
    netid = result["user"]["name"]

    user = User.first(netid: netid)

    unless user
        # Fetch user info, fill in what we can, and then return with token
        # Should be mostly for development
        user_data = Auth.get_user_info(session_token)

        user = User.create(
            netid: netid,
            first_name: user_data["user"]["first-name"],
            last_name: user_data["user"]["last-name"],
            paid: true # must be an ACM user to have gotten here
        )
    end

    response = JSON.parse(ResponseFormat.data(user))
    response['data']['token'] = session_token

    response.to_json
end

put '/users/:id/paid' do
    # For marking a user as paid (basically make them approved)
    halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env)

    user = User.get(params[:id])
    halt 404, ResponseFormat.error("User not found") unless user
    halt 400, ResponseFormat.error("User is already a member") if user.paid

    user.update(paid: true) || halt(500, ResponseFormat.error("Error updating user."))
    ResponseFormat.data(User.all(order: [ :paid.asc, :created_at.desc ]))
    
    # TODO initiate some sort of crowd script that adds them to the AD or w/e
end

post '/users/logout' do
    # Talk to crowd, clear session
    params = ResponseFormat.get_params(request.body.read)
    
    status, error = User.validate(params, [:token])
    halt status, ResponseFormat.error(error) if error

    Auth.logout(params[:token])

    ResponseFormat.message("OK")
end

delete '/users/:id' do
    halt 401, Errors::VERIFY_CREDS unless Auth.verify_admin(env)
    
    user = User.get(params[:id])
    halt 404, ResponseFormat.error("User not found") unless user

    user.destroy
    ResponseFormat.data(User.all(order: [ :paid.asc, :created_at.desc ]))
end
