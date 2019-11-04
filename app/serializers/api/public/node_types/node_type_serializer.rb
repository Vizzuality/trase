module Api
  module Public
    module NodeTypes
      class NodeTypeSerializer < ActiveModel::Serializer
        attributes :id,
                   :name,
                   :role
      end
    end
  end
end
