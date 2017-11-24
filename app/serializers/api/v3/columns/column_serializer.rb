module Api
  module V3
    module Columns
      class ColumnSerializer < ActiveModel::Serializer
        attributes :id, :name, :position, :group, :is_default, :is_geo

        attribute :profile_type do
          case object.name
          when 'IMPORTER / EXPORTER'
            'actor'
          when 'MUNICIPALITY'
            'place'
          else
            nil
          end
        end
      end
    end
  end
end