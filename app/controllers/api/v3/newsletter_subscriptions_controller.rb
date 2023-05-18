module Api
  module V3
    class NewsletterSubscriptionsController < ApiController
      skip_before_action :load_context

      def create
        ensure_required_param_present(:email)
        ensure_required_param_present(:source)
        begin
          signup_result = Api::V3::CreateNewsletterSubscription.new.call(
            params.slice(
              :source, :email, :firstname, :lastname, :country, :organisation, :trase_type, :trase_use, :trase_work, :trase_mail
            ),
            request.referer
          )
        rescue ArgumentError => e
          raise ActionController::ParameterMissing, e.message
        end
        render json: {error: signup_result.message} unless signup_result.ok?
      end
    end
  end
end
