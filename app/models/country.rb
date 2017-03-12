# == Schema Information
#
# Table name: countries
#
#  country_id :integer          not null, primary key
#  name       :text
#  iso2       :text
#  latitude   :float
#  longitude  :float
#  zoom       :integer
#

class Country < ActiveRecord::Base

    self.primary_key = :country_id

    has_many :contexts, :class_name => 'Context', :foreign_key => :country_id
end
