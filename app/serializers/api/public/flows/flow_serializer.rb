module Api
  module Public
    module Flows
      class FlowSerializer < ActiveModel::Serializer
        attributes :year,
                   :path,
                   :flow_attributes
      end
    end
  end
end
