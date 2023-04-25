require "rails_helper"

RSpec.describe Api::V3::NewsletterSubscriptionsController, type: :controller do
  describe "POST create" do
    it "rescues from Mailchimp::ListAlreadySubscribedError" do
      allow_any_instance_of(Mailchimp::Lists).to receive(:subscribe).and_raise(Mailchimp::ListAlreadySubscribedError)
      post :create, params: {email: "john.doe@example.com"}
      expect(response).to be_successful
    end
  end
end
