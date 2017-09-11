# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

class Token
  include DataMapper::Resource

  property :id, Serial
  property :netid, String, required: true, unique_index: true
  property :token, String, required: true
  property :created_at, DateTime

  def serialize
    {
      netid: netid,
      token: token,
      created_at: created_at,
    }
  end
end
