module Api
  module V3
    module Flows
      class ResultSerializer < ActiveModel::Serializer
        attributes :data, :include
      end
    end
  end
end
