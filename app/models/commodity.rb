# == Schema Information
#
# Table name: commodities
#
#  commodity_id :integer          not null, primary key
#  name         :text
#

class Commodity < ActiveRecord::Base
  self.primary_key = :commodity_id

  has_many :contexts, class_name: 'Context', foreign_key: :commodity_id
end
