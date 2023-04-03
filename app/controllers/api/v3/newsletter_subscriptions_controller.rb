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
        ensure_required_param_present(:email)
        client = MailchimpMarketing::Client.new()
        client.set_config({
          :api_key => ENV['MAILCHIMP_API_KEY'],
          :server => ENV['MAILCHIMP_SERVER_PREFIX']
        })
        body = {
          email_address: params[:email],
          status: 'subscribed',
          merge_fields: {
            'FNAME' => params[:firstname],
            # TODO: this comes undefined
            'LNAME' => (params[:lastname] && params[:lastname] != "") ? params[:lastname] : "-",
            'COUNTRY' => params[:country] || "-",
            'MMERGE3' => params[:organisation],
            'TRASETYPE' => params[:trase_type],
            'TRASEUSE' => params[:trase_use],
            'TRASEWORK' => params[:trase_work],
            'REFERRER' => request.referer
          }
        }
        client.lists.add_list_member(ENV['MAILCHIMP_LIST_ID'], body)
      rescue MailchimpMarketing::ApiError => e
        Appsignal.send_error(e)
        render json: {error: 'MailChimp API error'}
      rescue => e
        render json: {error: e.message}
        Appsignal.send_error(e)
      end
    end
  end
end
