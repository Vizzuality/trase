# == Schema Information
#
# Table name: countries_wb_indicators
#
#  id       :bigint(8)        not null, primary key
#  iso_code :text             not null
#  year     :integer          not null
#  name     :text             not null
#  value    :float            not null
#  rank     :integer          not null
#
module Api
  module V3
    class CountriesWbIndicator < BaseModel
      validates :iso_code, presence: true
      validates :year, presence: true
      validates :name, presence: true, uniqueness: {scope: [:iso_code, :year]}
      validates :value, presence: true
      validates :rank, presence: true
    end
  end
end
