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

module Notification
  NOTIFICATION_URL = '/notification'.freeze
  SENDER_EMAIL = 'acm@acm.illinois.edu'.freeze

  def self.services_url
    Config.load_config('groot')['host']
  end

  def self.groot_access_key
    Config.load_config('groot')['access_key']
  end

  # Sends an email to the given recipient with the given subject and message
  def self.send_email(recipient, subject, message)
    uri = URI.parse("#{Notification.services_url}#{NOTIFICATION_URL}")
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = {
      services: [{
        name: 'email',
        sender: SENDER_EMAIL,
        recipients: [recipient],
        subject: subject
      }],
      message: message
    }.to_json
    request['Authorization'] = Notification.groot_access_key
    request['Accept'] = 'application/json'
    request['Content-Type'] = 'application/json'

    response = http.request(request)
    response.code == '200'
  end
end
