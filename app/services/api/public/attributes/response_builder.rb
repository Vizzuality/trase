module Api
  module Public
    module Attributes
      class ResponseBuilder
        attr_reader :data

        def initialize(params = {})
          initialize_params(params)
        end

        def call
          initialize_flow_attributes

          initialize_data
        end

        private

        def initialize_params(params)
          if params[:country]
            @country = Api::V3::Country.find_by(name: params[:country])
            raise 'Country not found' unless @country
          end

          return unless params[:commodity]
          @commodity = Api::V3::Commodity.find_by(name: params[:commodity])
          raise 'Commodity not found' unless @commodity
        end

        def initialize_flow_attributes
          @query = flow_attributes_query

          @query = @query.where('contexts.country_id = ?', @country.id) if @country

          if @commodity
            @query = @query.where('contexts.commodity_id = ?', @commodity.id)
          end

          @query
        end

        def flow_attributes_query
          Api::Public::Readonly::FlowAttribute.
            select(*flow_attributes_select_clause).
            joins('INNER JOIN contexts ON ' \
                  'contexts.id = flow_attributes_mv.context_id').
            joins('INNER JOIN countries ON ' \
                  'countries.id = contexts.country_id').
            joins('INNER JOIN commodities ON ' \
                  'commodities.id = contexts.commodity_id').
            group(*flow_attributes_group_clause)
        end

        def flow_attributes_select_clause
          [
            'name',
            'display_name',
            'unit',
            'json_agg(' \
              'json_build_object(' \
                '\'country\', countries.name, ' \
                '\'commodity\', commodities.name, ' \
                '\'years\', flow_attributes_mv.years' \
              ')' \
            ') AS availability'
          ]
        end

        def flow_attributes_group_clause
          %w[name display_name unit]
        end

        def initialize_data
          @data = ActiveModelSerializers::SerializableResource.new(
            @query,
            each_serializer: Api::Public::Attributes::FlowAttributeSerializer,
            root: 'data'
          ).serializable_hash[:data]
        end
      end
    end
  end
end
