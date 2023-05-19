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
      # Subscribe to newsletter - *|TRASEMAIL|*
      # *|SIGNUPLOC|*
      def call(params, referrer)
        @email = params[:email]&.downcase&.squish
        raise ArgumentError.new("Missing email") unless @email

        @source = params[:source]&.downcase&.squish
        unless ["footer", "download"].include?(@source)
          raise ArgumentError.new("Invalid source")
        end
        body = {
          email_address: params[:email],
          status: subscription_status(params[:subscribe]),
          merge_fields: merge_fields(params, referrer)
        }
        response = @client.lists.add_list_member(audience_id, body)
        Rails.logger.debug response
        CreateNewsletterSubscriptionResult.new(:ok, response, nil)
      rescue MailchimpMarketing::ApiError => e
        Rails.logger.debug e
        Appsignal.send_error(e)
        CreateNewsletterSubscriptionResult.new(e.status, nil, e.message)
      end

      private

      def footer_form?
        @source == "footer"
      end

      def audience_id
        if footer_form?
          ENV["MAILCHIMP_MAIN_LIST_ID"]
        else
          ENV["MAILCHIMP_LIST_ID"]
        end
      end

      def subscription_status(subscribe_param)
        if ["yes", "true", "1"].include?(subscribe_param&.downcase)
          :subscribed
        else
          :unsubscribed
        end
      end

      def merge_fields(params, referrer)
        common_merge_fields = {
          "FNAME" => params[:firstname].presence || "-",
          "LNAME" => params[:lastname].presence || "-",
          "MMERGE3" => params[:organisation].presence || "-",
          "SIGNUPLOC" => referrer # from request
        }
        return common_merge_fields if footer_form?

        common_merge_fields.merge({
          "COUNTRY" => params[:country].presence,
          "TRASETYPE" => params[:trase_type].presence,
          "TRASEUSE" => params[:trase_use].presence,
          "TRASEWORK" => params[:trase_work].presence,
          "TRASEMAIL" => params[:subscribe]
        })
      end
    end
  end
end
