module Api
  module Private
    class NodeTypeRefSerializer < ActiveModel::Serializer
      attributes :name
    end
  end
end
