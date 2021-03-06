# Copyright © 2017, ACM@UIUC
#
# This file is part of the Groot Project.
#
# The Groot Project is open source software, released under the University of
# Illinois/NCSA Open Source License. You should have received a copy of
# this license in a file with the distribution.

class User
  include DataMapper::Resource

  property :id, Serial
  property :is_member, Boolean, default: false
  property :netid, String, required: true, unique_index: true
  property :first_name, String, required: true
  property :last_name, String, required: true
  property :uin, Integer, unique: true
  property :added_to_directory, Boolean, default: false
  property :created_at, DateTime

  def self.validate(params, attributes)
    attributes.each do |attr|
      return [400, "Missing #{attr}"] unless params[attr] && !params[attr].empty?

      case attr
      when :uin
        int_value = begin
                      Integer(params[:uin])
                    rescue ArgumentError
                      nil
                    end
        return [400, 'UIN must be an integer'] unless int_value
      when :netid
        invalid_netid = /^[a-z]{2,7}[0-9]{1,4}$/.match(params[:netid]).nil? ||
                        params[:netid].length > 8
        return [400, 'A valid netid must be entered'] if invalid_netid
      end
    end

    [200, nil]
  end

  def serialize
    {
      first_name: first_name,
      last_name: last_name,
      netid: netid,
      created_at: created_at,
      is_member: is_member,
      added_to_directory: added_to_directory
    }
  end
end
