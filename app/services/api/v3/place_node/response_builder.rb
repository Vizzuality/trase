module Api
  module V3
    module PlaceNode
      class ResponseBuilder
        include ActiveModel::Serialization
        attr_reader :errors
        delegate :column_name, :country_name, :country_geo_id, :summary, to: :@basic_attributes

        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @errors = []
        end

        def call
          intialize_dictionaries
          @basic_attributes = Api::V3::PlaceNode::BasicAttributes.new(
            @context, @node, @place_inds, @place_quants
          )
          self
        end

        private

        def intialize_dictionaries
          @place_quants = Hash[(@node.place_quants + @node.temporal_place_quants(@year)).map do |e|
            [e['name'], e]
          end]
          @place_inds = Hash[(@node.place_inds + @node.temporal_place_inds(@year)).map do |e|
            [e['name'], e]
          end]
        end
      end
    end
  end
end
