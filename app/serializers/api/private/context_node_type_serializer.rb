module Api
  module Private
    class ContextNodeTypeSerializer < ActiveModel::Serializer
      belongs_to :node_type, serializer: Api::Private::NodeTypeRefSerializer
      has_one :context_node_type_property, serializer: Api::Private::ContextNodeTypePropertySerializer
      has_one :profile, serializer: Api::Private::ProfileSerializer
    end
  end
end
