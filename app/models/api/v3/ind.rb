module Api
  module V3
    class Ind < BaseModel
      has_one :ind_property
      delegate :display_name, to: :ind_property
    end
  end
end
