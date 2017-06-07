module Api
  module V2
    class ContentController < ApiController

      def posts
        posts = Content::Post.order(:date => 'DESC').where(:state => 1)
        render json: posts
      end

      def site_dive
        render json: Content::SiteDive.find(params[:id])
      end

      def tweets
        render json: [] and return unless ENV['TWITTER_CONSUMER_KEY'].present? and ENV['TWITTER_CONSUMER_SECRET'].present? and ENV['TWITTER_ACCESS_TOKEN'].present? and ENV['TWITTER_ACCESS_TOKEN_SECRET'].present?

        client = Twitter::REST::Client.new do |config|
          config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
          config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
          config.access_token = ENV['TWITTER_ACCESS_TOKEN']
          config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
        end

        # render json: client.home_timeline
        render json: client.home_timeline.map {|tweet| {'text' => tweet.text, 'screen_name' => tweet.user.screen_name, 'created_at' => tweet.created_at}}
      end
    end
  end
end
