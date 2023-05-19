require "rails_helper"

RSpec.describe Api::V3::NewsletterSubscriptionsController, type: :controller do
  describe "POST create" do
    it "rescues from Mailchimp API error" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member).and_raise(MailchimpMarketing::ApiError)
      post :create, params: {email: "john.doe@example.com", source: "footer"}
      expect(response).to be_successful
    end

    it "returns bad request when email not given" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
      post :create, params: {email: "", source: "footer"}
      expect(response).to be_bad_request
    end

    # it "returns bad request when source not given" do
    #   allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
    #   post :create, params: {email: "xxx@example.com", source: ""}
    #   expect(response).to be_bad_request
    # end
    #
    # it "returns bad request when source invalid" do
    #   allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
    #   post :create, params: {email: "xxx@example.com", source: "foobar"}
    #   expect(response).to be_bad_request
    # end
  end
end
