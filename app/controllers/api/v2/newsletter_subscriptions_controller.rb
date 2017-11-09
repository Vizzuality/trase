module Api
  module V2
    class NewsletterSubscriptionsController < ApiController
      skip_before_action :verify_authenticity_token
      skip_before_action :load_context

      def create
        mailchimp = Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
        response = mailchimp.lists.subscribe(
          ENV['MAILCHIMP_LIST_ID'], email: params[:email]
        )
        render json: response and return
      rescue Error => e
        render json: {error: e.message}
        Rails.logger.error e.message
        e.backtrace.each { |l| Rails.logger.error l }
      end
    end
  end
end
