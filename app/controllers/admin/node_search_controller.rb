module Admin
  class NodeSearchController < ::Api::ApiController
    skip_before_action :load_context

    def source_search
      @q = Api::V3::Readonly::Dashboards::Source.
        select("dashboards_sources_mv.name, dashboards_sources_mv.node_type, dashboards_sources_mv.id, countries.name as country_name, commodities.name as commodity_name").
        joins("LEFT JOIN commodities ON commodities.id = dashboards_sources_mv.commodity_id").
        joins("LEFT JOIN countries ON countries.id = dashboards_sources_mv.country_id").
        ransack(params[:q])
      @nodes = @q.result.order(:name).to_a.uniq

      render json: @nodes, root: "data",
             each_serializer: Admin::SourceSearchSerializer
    end

    def company_search
      @q = Api::V3::Readonly::Dashboards::Company.
        select("dashboards_companies_mv.name, dashboards_companies_mv.node_type, dashboards_companies_mv.id, countries.name as country_name, commodities.name as commodity_name").
        joins("LEFT JOIN commodities ON commodities.id = dashboards_companies_mv.commodity_id").
        joins("LEFT JOIN countries ON countries.id = dashboards_companies_mv.country_id").
        ransack(params[:q])
      @nodes = @q.result.order(:name).to_a.uniq

      render json: @nodes, root: "data",
             each_serializer: Admin::CompanySearchSerializer
    end

    def destination_search
      @q = Api::V3::Readonly::Dashboards::Destination.
        select("dashboards_destinations_mv.name, dashboards_destinations_mv.node_type, dashboards_destinations_mv.id, countries.name as country_name, commodities.name as commodity_name").
        joins("LEFT JOIN commodities ON commodities.id = dashboards_destinations_mv.commodity_id").
        joins("LEFT JOIN countries ON countries.id = dashboards_destinations_mv.country_id").
        ransack(params[:q])
      @nodes = @q.result.order(:name).to_a.uniq

      render json: @nodes, root: "data",
             each_serializer: Admin::DestinationSearchSerializer
    end
  end
end
