module Api
  module V3
    class DownloadAttributeSerializer < ActiveModel::Serializer
      attributes :name, :unit, :unit_type
      attribute :display_name, key: :frontend_name
      attribute :original_type, key: :indicator_type

      # temporary - removed column
      attribute :tooltip do
        nil
      end
    end
  end
end
