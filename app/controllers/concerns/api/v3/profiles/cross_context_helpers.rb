module Api
  module V3
    module Profiles
      module CrossContextHelpers
        extend ActiveSupport::Concern

        private

        def load_contexts
          if params[:context_id]
            @context = Api::V3::Context.find(params[:context_id])
            @contexts = [@context]
          else
            contexts = Api::V3::Context.all
            if params[:commodity_id]
              contexts = contexts.where(commodity_id: params[:commodity_id])
            end
            if params[:country_id]
              contexts = contexts.where(country_id: params[:country_id])
            end
            if params[:year]
              contexts = contexts.where('years && ARRAY[?]::INT[]', params[:year])
            end
            unless contexts.any?
              raise ActiveRecord::RecordNotFound.new(
                'No country commodity combinations found for given parameters'
              )
            end
            @contexts = contexts
          end
        end

        def load_node
          ensure_required_param_present(:id)
          nodes = Api::V3::Readonly::NodeWithFlows.all
          if (year = params[:year]&.to_i)
            nodes = nodes.where('years && ARRAY[?]::INT[]', year)
          end
          @node = nodes.find_by(
            id: params[:id],
            context_id: @contexts.map(&:id),
            profile: profile_type
          )
          unless @node.present?
            raise ActiveRecord::RecordNotFound.new(
              'Node not found for given parameters'
            )
          end
          @context = @node.context
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
