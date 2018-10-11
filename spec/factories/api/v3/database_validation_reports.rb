# == Schema Information
#
# Table name: database_validation_reports
#
#  id            :bigint(8)        not null, primary key
#  report        :json             not null
#  error_count   :integer          not null
#  warning_count :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryBot.define do
  factory :database_validation do
    report ''
    error_count 1
    warning_count 1
  end
end
