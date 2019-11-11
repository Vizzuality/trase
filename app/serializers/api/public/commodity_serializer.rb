module Api
  module Public
    class CommoditySerializer < ActiveModel::Serializer
      attributes :id, :name
      attribute :country_ids, if: :include_countries?

      def include_countries?
        @instance_options[:include_countries]
      end
    end
  end
end
