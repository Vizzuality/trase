# == Schema Information
#
# Table name: worldbanks
#
#  id          :bigint(8)        not null, primary key
#  name        :text             not null
#  last_update :datetime         not null
#
module Api
  module V3
    class Worldbank < BaseModel
      validates :name, presence: true
      validates :last_update, presence: true
    end
  end
end
