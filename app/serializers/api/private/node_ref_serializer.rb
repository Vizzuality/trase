module Api
  module Private
    class NodeRefSerializer < ActiveModel::Serializer
      attributes :name, :main_id, :geo_id
    end
  end
end
