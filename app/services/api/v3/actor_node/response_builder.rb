# @deprecated This allows to serve a combined response for the actor profile
# and will be retired when we amend front-end to use the split responses
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
          @basic_attributes = Api::V3::Actors::BasicAttributes.new(
            @context, @node, @year
          )

          top_nodes_summary = Api::V3::Actors::TopNodesSummary.new(
            @context, @node, @year
          )
          top_countries = top_nodes_summary.call(
            NodeTypeName::COUNTRY
          )
          top_sources = top_nodes_summary.call(
            [
              NodeTypeName::MUNICIPALITY,
              NodeTypeName::BIOME,
              NodeTypeName::STATE
            ]
          )
          sustainability = Api::V3::Actors::SustainabilityTable.new(
            @context, @node, @year
          ).call

          exporting_companies = Api::V3::Actors::ExportingCompaniesPlot.new(
            @context, @node, @year
          ).call

          @basic_attributes.call.
            merge(top_countries: top_countries).
            merge(top_sources: top_sources).
            merge(sustainability: sustainability).
            merge(companies_sourcing: exporting_companies)
        end
      end
    end
  end
end
