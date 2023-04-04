module Api
  module V3
    class CreateNewsletterSubscription
      CreateNewsletterSubscriptionResult = Struct.new(:status, :response, :message) do
        def ok?
          status == :ok
        end
      end

      def initialize
        @client = MailchimpMarketing::Client.new
        @client.set_config({
          api_key: ENV["MAILCHIMP_API_KEY"],
          server: ENV["MAILCHIMP_SERVER_PREFIX"]
        })
      end

      # Fields and their Mailchimp merge tags:
      # Given name - *|FNAME|* (can just send name here)
      # Surname - *|LNAME|*
      # Email - *|EMAIL|*
      # Country - *|COUNTRY|*
      # Organisation name - *|MMERGE3|*
      # Type of organisation - *|TRASETYPE|*
      # Use of Trase data - *|TRASEUSE|*
      # About your work - *|TRASEWORK|*
      def call(params, referrer)
        body = {
          email_address: params[:email],
          status: "subscribed",
          merge_fields: {
            "FNAME" => params[:firstname].presence || "-", # mandatory
            # TODO: this comes undefined, but is mandatory
            "LNAME" => params[:lastname] != "undefined" && params[:lastname].presence || "-", # mandatory
            "COUNTRY" => params[:country].presence || "-", # mandatory
            "MMERGE3" => params[:organisation].presence || "-", # mandatory
            "TRASETYPE" => params[:trase_type].presence || "-", # mandatory
            "TRASEUSE" => params[:trase_use].presence || "-", # mandatory
            "TRASEWORK" => params[:trase_work].presence || "-", # mandatory
            "SIGNUPLOC" => referrer # from request
          }
        }
        response = @client.lists.add_list_member(ENV["MAILCHIMP_LIST_ID"], body)
        Rails.logger.debug response
        CreateNewsletterSubscriptionResult.new(:ok, response, nil)
      rescue MailchimpMarketing::ApiError => e
        Rails.logger.debug e
        Appsignal.send_error(e)
        CreateNewsletterSubscriptionResult.new(e.status, nil, e.message)
      end
    end
  end
end
