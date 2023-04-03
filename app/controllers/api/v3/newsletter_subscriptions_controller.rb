module Api
  module V3
    class NewsletterSubscriptionsController < ApiController
      skip_before_action :load_context

      # Fields and their Mailchimp merge tags:
      # Given name - *|FNAME|* (can just send name here)
      # Surname - *|LNAME|*
      # Email - *|EMAIL|*
      # Country - *|COUNTRY|*
      # Organisation name - *|MMERGE3|*
      # Type of organisation - is this a dropdown or can people type anything they want? I've created the field as a text field for now - *|TRASETYPE|*
      # Use of Trase data - *|TRASEUSE|*
      # About your work - *|TRASEWORK|*
      def create
        mailchimp = Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
        response = mailchimp.lists.subscribe(
          ENV['MAILCHIMP_LIST_ID'],
          { email: params[:email] },
          {
            'FNAME' => params[:firstname],
            # TODO: this comes undefined
            'LNAME' => (params[:lastname] && params[:lastname] != "") ? params[:lastname] : "-",
            'EMAIL' => params[:email],
            'COUNTRY' => params[:country] || "-",
            'MMERGE3' => params[:organisation],
            'TRASETYPE' => params[:trase_type],
            'TRASEUSE' => params[:trase_use],
            'TRASEWORK' => params[:trase_work],
            'REFERRER' => request.referer
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
