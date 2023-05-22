require "rails_helper"

RSpec.describe Content::TweetsController, type: :controller do
  describe "GET index" do
    let(:tweets) { File.read("spec/support/tweets.json") }
    let(:first_tweet) {
      {
        "text" => "📢 Last chance to take part in the <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/TraseEarth'>@TraseEarth</a> user survey! \n\nTell us how you use Trase to help us learn how it can… <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/i/web/status/1660556100339474432'>twitter.com/i/web/status/1…</a>",
        "screenName" => "TraseEarth",
        "createdAt" => "2023-05-22T08:00:00.000Z",
        "profilePictureUrl" => "https://pbs.twimg.com/profile_images/1399711664132571139/G2CaTHP1_normal.jpg"
      }
    }
    it "returns tweets" do
      stub_request(:get, "https://api.twitter.com/1.1/statuses/user_timeline.json").to_return(status: 200, body: tweets, headers: {"content-type" => "application/json;charset=utf-8"})
      get :index
      tweets = JSON.parse(response.body)["data"]
      expect(tweets.first).to eq(first_tweet)
    end
  end
end
