module Api
  module Public
    module NodeTypes
      class PathNodeTypesSerializer < ActiveModel::Serializer
        attributes :country,
                   :commodity
        has_many :node_types
      end
    end
  end
end
