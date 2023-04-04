module Api
  module V3
    class NewsletterSubscriptionsController < ApiController
      skip_before_action :load_context

      def create
        ensure_required_param_present(:email)
        signup_result = Api::V3::CreateNewsletterSubscription.new.call(
          params.slice(
            :email, :firstname, :lastname, :country, :organisation, :trase_type, :trase_use, :trase_work
          ),
          request.referer
        )
        render json: {error: signup_result.message} unless signup_result.ok?
      end
    end
  end
end
