module Api
  module V3
    module ActorNode
      class ResponseBuilder
        include ActiveModel::Serialization

        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
        end

        def call
          @basic_attributes = Api::V3::ActorNode::BasicAttributes.new(
            @context, @year, @node
          )

          top_nodes_summary = Api::V3::ActorNode::TopNodesSummary.new(
            @context, @year, @node
          )
          top_countries = top_nodes_summary.call(
            :top_countries, NodeTypeName::COUNTRY
          )
          top_sources = top_nodes_summary.call(
            :top_sources,
            [
              NodeTypeName::MUNICIPALITY,
              NodeTypeName::BIOME,
              NodeTypeName::STATE
            ]
          )
          sustainability = Api::V3::ActorNode::SustainabilityTable.new(
            @context, @year, @node
          ).call

          exporting_companies = Api::V3::ActorNode::ExportingCompaniesPlot.new(
            @context, @year, @node
          ).call

          @basic_attributes.attributes.
            merge(top_countries).
            merge(top_sources).
            merge(sustainability).
            merge(exporting_companies)
        end
      end
    end
  end
end
