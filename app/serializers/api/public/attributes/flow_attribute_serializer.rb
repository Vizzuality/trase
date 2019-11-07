module Api
  module Public
    module Attributes
      class FlowAttributeSerializer < ActiveModel::Serializer
        attributes :attribute_id,
                   :name,
                   :display_name,
                   :unit,
                   :availability
      end
    end
  end
end
