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

module ActiveDirectory
  ADD_USER_URL = '/activedirectory/add/'.freeze

  def self.ad_service_url
    Config.load_config('groot')['ad_host']
  end

  def self.ad_access_token
    Config.load_config('groot')['ad_access_token']
  end

  # Adds the given user to the ACM Active Directory
  def self.add_user(netid)
    uri = URI.parse("#{ActiveDirectory.ad_service_url}#{ADD_USER_URL}#{netid}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.read_timeout = 60 # AD Service can take a long time
    request = Net::HTTP::Get.new(uri.request_uri)
    request['Authorization'] = ActiveDirectory.ad_access_token
    request['Accept'] = 'application/json'
    request['Content-Type'] = 'application/json'

    response = http.request(request)
    response.code == '200'
  end
end
