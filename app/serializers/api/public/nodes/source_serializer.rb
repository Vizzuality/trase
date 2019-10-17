module Api
  module Public
    module Nodes
      class SourceSerializer < ActiveModel::Serializer
        attributes :id,
                   :name,
                   :node_type,
                   :geo_id,
                   :availability
      end
    end
  end
end
