# == Schema Information
#
# Table name: external_api_updates
#
#  id            :bigint(8)        not null, primary key
#  name          :text             not null
#  last_update   :datetime         not null
#  resource_name :text
#
module Api
  module V3
    class ExternalApiUpdate < BaseModel
      validates :name, presence: true
      validates :last_update, presence: true
    end
  end
end
