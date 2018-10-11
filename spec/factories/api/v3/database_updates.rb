# == Schema Information
#
# Table name: database_updates
#
#  id         :bigint(8)        not null, primary key
#  stats      :json
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  jid        :text
#  status     :text             default("STARTED"), not null
#  error      :text
#
# Indexes
#
#  database_updates_jid_key          (jid) UNIQUE
#  index_database_updates_on_status  (status) UNIQUE WHERE (status = 'STARTED'::text)
#

FactoryBot.define do
  factory :api_v3_database_update, class: 'Api::V3::DatabaseUpdate' do
    status 'STARTED'
  end
end
