module Api
  module V3
    module Profiles
      module CrossContextHelpers
        extend ActiveSupport::Concern

        private

        def load_node
          ensure_required_param_present(:id)
          nodes = Api::V3::Readonly::NodeWithFlows.where(
            profile: profile_type, id: params[:id]
          )
          if (context_id = params[:context_id])
            nodes = nodes.where(context_id: context_id)
          else
            if (commodity_id = params[:commodity_id])
              nodes = nodes.where(commodity_id: commodity_id)
            end
            if (country_id = params[:country_id])
              nodes = contexts.where(country_id: country_id)
            end
          end
          if (year = params[:year]&.to_i)
            nodes = nodes.where('years && ARRAY[?]::INT[]', year)
          end

          @contexts = Api::V3::Context.where(id: nodes.select(:context_id))
          @node = nodes.first

          unless @node.present?
            raise ActiveRecord::RecordNotFound.new(
              'Node not found for given parameters'
            )
          end
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

        def ensure_commodity_or_context_given
          return if params[:commodity_id].present? || params[:context_id].present?

          raise ActionController::ParameterMissing,
                "Required param commodity_id or context_id missing"
        end
      end
    end
  end
end
