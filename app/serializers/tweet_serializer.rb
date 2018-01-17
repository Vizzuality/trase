class TweetSerializer < ActiveModel::Serializer
  attributes :text, :screen_name, :created_at, :profile_picture_url

  # Since we are using this serializer on Twitter::Tweet objects, and not on ActiveRecord entries, we need these apparently redundant methods
  def text
    hidrate_tweet(object.full_text, object.urls, object.hashtags, object.user_mentions)
  end

  def screen_name
    object.user.screen_name
  end

  def created_at
    object.created_at
  end

  def profile_picture_url
    object.user.profile_image_url_https.to_s
  end

  private

  def hidrate_tweet(text, urls, hashtags, mentions)
    processed = text.dup
    urls.each do |url|
      processed.gsub! url.url, "<a target='_blank' rel='noopener noreferrer' href='#{url.expanded_url}'>#{url.display_url}</a>"
    end
    hashtags.each do |hashtag|
      processed.gsub! "##{hashtag.text}", "<a target='_blank' rel='noopener noreferrer' href='https://twitter.com/hashtag/#{hashtag.text}'>##{hashtag.text}</a>"
    end
    mentions.each do |mention|
      processed.gsub! "@#{mention.screen_name}", "<a target='_blank' rel='noopener noreferrer' href='https://twitter.com/#{mention.screen_name}'>@#{mention.screen_name}</a>"
    end
    processed
  end
end
