# == Schema Information
#
# Table name: countries
#
#  country_id :integer          not null, primary key
#  name       :text
#  iso2       :text
#

class Country < ActiveRecord::Base

  self.primary_key = :country_id

  has_many :flows, :class_name => 'Flow', :foreign_key => :country_id
end
