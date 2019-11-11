module Api
  module Public
    class FilterCountries
      def initialize(params)
        @meta = {}
        @self_ids = params.delete(:countries_ids)
        @include_commodities = params[:include] == 'commodities'
        @commodities_ids = params[:commodities_ids] || []

        initialize_query
      end

      def call
        {data: @query, meta: @meta}
      end

      private

      def initialize_query
        @query = Api::V3::Context.
          select('contexts.country_id AS id', 'countries.name').
          joins('INNER JOIN countries ON countries.id = contexts.country_id').
          group('contexts.country_id', 'countries.name').
          order('countries.name')

        if @commodities_ids.any?
          @query = @query.where(commodity_id: @commodities_ids)
        end

        include_commodities if @include_commodities
      end

      def include_commodities
        @query = @query.select(
          'contexts.country_id AS id',
          'countries.name',
          'ARRAY_AGG(commodity_id) AS commodity_ids'
        )

        commodity_ids = @query.map(&:commodity_ids).flatten.uniq
        commodities = Api::V3::Commodity.where(id: commodity_ids)
        @meta[:commodities] = ActiveModel::Serializer::CollectionSerializer.new(
          commodities, serializer: Api::Public::CommoditySerializer
        ).as_json
      end
    end
  end
end
