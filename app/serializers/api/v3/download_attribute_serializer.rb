module Api
  module V3
    class DownloadAttributeSerializer < ActiveModel::Serializer
      attributes :name, :unit, :unit_type, :years
      attribute :frontend_name
      attribute :original_type, key: :indicator_type
      attribute :filter_options

      def frontend_name
        object.readonly_attribute.display_name
      end

      def filter_options
        return qual_filter_options if object.original_type == "Qual"

        quant_filter_options
      end

      def qual_filter_options
        values = Api::V3::NodeQual.
          where(qual_id: object.original_id).
          select(:value).
          distinct.
          pluck(:value)
        {
          ops: Api::V3::Download::FlowDownloadQueryBuilder::QUAL_OPS.keys,
          values: values
        }
      end

      def quant_filter_options
        {
          ops: Api::V3::Download::FlowDownloadQueryBuilder::QUANT_OPS.keys
        }
      end
    end
  end
end
