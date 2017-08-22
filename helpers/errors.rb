# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

require_relative 'response_format'
module Errors
  VERIFY_GROOT = ResponseFormat.error 'Request did not originate from groot'
  VERIFY_CREDS = ResponseFormat.error 'Request did not originate from valid admin privileges'
  USER_NOT_FOUND = ResponseFormat.error 'User not found'
end
