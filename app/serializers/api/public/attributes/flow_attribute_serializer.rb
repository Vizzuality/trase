module Api
  module Public
    module Attributes
      class FlowAttributeSerializer < ActiveModel::Serializer
        attributes :id,
                   :name,
                   :display_name,
                   :unit,
                   :unit_type,
                   :availability
      end
    end
  end
end
