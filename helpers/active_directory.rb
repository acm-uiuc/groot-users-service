# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

require 'net/http'
require 'uri'
require 'pry'
require_relative '../models/user'

module ActiveDirectory
  ADD_USER_URL = '/activedirectory/add'.freeze

  def self.services_url
    Config.load_config('groot')['host']
  end

  def self.groot_access_key
    Config.load_config('groot')['access_key']
  end

  # Adds the given user to the ACM Active Directory
  def self.add_user(netid)
    uri = URI.parse("#{ActiveDirectory.services_url}#{ADD_USER_URL}")
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = {
      netid: netid
    }.to_json
    request['Authorization'] = groot_access_key
    request['Accept'] = 'application/json'
    request['Content-Type'] = 'application/json'
    response = http.request(request)

    return false unless response.code == '200'

    user = User.first(netid: netid)
    return false unless user && user.is_member

    user.update(added_to_directory: true)
  end
end
