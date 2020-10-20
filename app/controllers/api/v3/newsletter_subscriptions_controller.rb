module Api
  module V3
    class NewsletterSubscriptionsController < ApiController
      skip_before_action :load_context

      def create
        mailchimp = Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
        response = mailchimp.lists.subscribe(
          ENV['MAILCHIMP_LIST_ID'],
          { email: params[:email] },
          {
            'FNAME' => params[:firstname],
            'LNAME' => params[:lastname],
            'MMERGE3' => params[:organisation],
            'MMERGE4' => "-"
          }
        )
        p response
        render json: response and return
      rescue Mailchimp::ListAlreadySubscribedError
        # noop
        render json: {email: params[:email]}
      rescue => e
        render json: {error: e.message}
        Appsignal.send_error(e)
        Rails.logger.error e.message
        e.backtrace.each { |l| Rails.logger.error l }
      end
    end
  end
end
