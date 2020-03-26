module Api
  module V3
    module Profiles
      class ProfileMetaController < ApiController
        skip_before_action :load_context
        before_action :load_node_and_context

        def show
          @result = Api::V3::Profiles::ProfileMeta.new(
            @node_with_flows, @context
          )

          render json: @result,
                 root: 'data',
                 key_transform: :underscore
        end

        private

        def load_node_and_context
          if params[:context_id]
            load_by_context_id
          else
            load_best_match
          end
        end

        def load_by_context_id
          @context = Api::V3::Context.find(params[:context_id])
          @node_with_flows = Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            with_profile.
            where(context_id: @context.id).
            find(params[:id])
        end

        def load_best_match
          contexts = Api::V3::Context.all
          if params[:commodity_id]
            contexts = contexts.where(commodity_id: params[:commodity_id])
          end
          if params[:country_id]
            contexts = contexts.where(country_id: params[:country_id])
          end
          @node_with_flows = Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            with_profile.
            where(context_id: contexts).
            find(params[:id])
          @context = @node_with_flows.context
        end
      end
    end
  end
end
