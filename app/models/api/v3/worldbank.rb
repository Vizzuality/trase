module Api
  module V3
    class Worldbank < BaseModel
      validates :name, presence: true
      validates :last_update, presence: true
    end
  end
end
