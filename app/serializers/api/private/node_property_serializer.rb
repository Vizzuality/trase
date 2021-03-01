module Api
  module Private
    class NodePropertySerializer < ActiveModel::Serializer
      attributes :is_domestic_consumption
    end
  end
end
