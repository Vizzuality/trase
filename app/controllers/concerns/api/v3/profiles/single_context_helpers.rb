module Api
  module V3
    module Profiles
      module SingleContextHelpers
        extend ActiveSupport::Concern

        private

        def load_node
          ensure_required_param_present(:id)
          @node = Api::V3::Readonly::NodeWithFlows.find_by(
            id: params[:id],
            context_id: @context.id,
            profile: profile_type
          )
          return if @node.present?

          raise ActiveRecord::RecordNotFound.new(
            "Node not found for given parameters"
          )
        end

        def set_year
          node_years = @node.years
          raise ActiveRecord::RecordNotFound unless node_years.any?

          year = params[:year]&.to_i
          @year =
            if year && node_years.include?(year)
              year
            else
              node_years.last
            end
        end
      end
    end
  end
end
