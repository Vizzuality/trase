module Api
  module Public
    module Node
      class NodeSerializer < ActiveModel::Serializer
        attributes :name,
                   :node_type,
                   :geo_id,
                   :availability,
                   :node_indicators,
                   :flow_indicators
      end
    end
  end
end
