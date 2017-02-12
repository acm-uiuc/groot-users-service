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
    property :paid, Boolean, default: false
    property :netid, String, required: true, unique_index: true
    property :first_name, String, required: true
    property :last_name, String, required: true
    property :uin, Integer, unique: true, default: 0
    property :graduation_date, Date, default: Date.today.next_year.next_year.next_year.next_year
    property :created_at, DateTime

    def self.validate(params, attributes)
      attributes.each do |attr|
        return [400, "Missing #{attr}"] unless params[attr] && !params[attr].empty?
      end
      
      return [200, nil]
    end

    def serialize
      {
        first_name: self.first_name,
        last_name: self.last_name,
        netid: self.netid,
        graduation_date: self.graduation_date,
        created_at: self.created_at,
        paid: self.paid
      }
    end
end