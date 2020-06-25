# == Schema Information
#
# Table name: countries_wb_indicators
#
#  id    :bigint(8)        not null, primary key
#  iso3  :text             not null
#  year  :integer          not null
#  name  :text             not null
#  value :float            not null
#  rank  :integer          not null
#  iso2  :text             not null
#
module Api
  module V3
    class CountriesWbIndicator < BaseModel
      validates :iso3, presence: true
      validates :iso2, presence: true
      validates :year, presence: true
      validates :name, presence: true
      validates :value, presence: true
      validates :rank, presence: true
    end
  end
end
