# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

require 'sucker_punch'
require_relative '../helpers/notification'

class EmailNotificationJob
  include SuckerPunch::Job
  include Notification

  def perform(recipient, subject, message)
    Notification.send_email(recipient, subject, message)
  end
end
