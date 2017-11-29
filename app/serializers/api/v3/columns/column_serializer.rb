module Api
  module V3
    module Columns
      class ColumnSerializer < ActiveModel::Serializer
        attributes :id, :name, :position, :group, :is_default, :is_geo, :profile_type
      end
    end
  end
end
