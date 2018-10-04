module Admin
  class NodeSearchSerializer < ActiveModel::Serializer
    attributes :id, :main_id, :name, :stringify
  end
end
