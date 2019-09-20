module Api
  module V3
    module Columns
      class ColumnSerializer < ActiveModel::Serializer
        attributes :id, :name, :position, :group, :role, :is_default, :is_geo,
                   :is_choropleth_disabled, :profile_type
      end
    end
  end
end
