# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

require 'sucker_punch'
require_relative '../helpers/active_directory'

class ActiveDirectoryJob
  include SuckerPunch::Job
  include ActiveDirectory

  def perform(netid)
    successful = ActiveDirectory.add_user(netid)
    # need to mark user as 'added_to_directory' if success
    # ActiveDirectoryJob.perform_in(300, netid) unless successful
    # successful
  end
end
