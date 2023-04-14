module Content
  class TweetsController < ApplicationController
    before_action :set_caching_headers

    def index
      render json: [] and return unless ENV["TWITTER_CONSUMER_KEY"].present? and ENV["TWITTER_CONSUMER_SECRET"].present? and ENV["TWITTER_ACCESS_TOKEN"].present? and ENV["TWITTER_ACCESS_TOKEN_SECRET"].present?

      client = Twitter::REST::Client.new do |config|
        config.consumer_key = ENV["TWITTER_CONSUMER_KEY"]
        config.consumer_secret = ENV["TWITTER_CONSUMER_SECRET"]
        config.access_token = ENV["TWITTER_ACCESS_TOKEN"]
        config.access_token_secret = ENV["TWITTER_ACCESS_TOKEN_SECRET"]
      end

      render json: client.user_timeline,
             root: "data",
             each_serializer: Content::TweetSerializer
    end
  end
end
