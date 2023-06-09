require "rails_helper"

RSpec.describe Api::V3::NewsletterSubscriptionsController, type: :controller do
  describe "POST create" do
    it "rescues from Mailchimp API error" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member).and_raise(MailchimpMarketing::ApiError.new)
      post :create, params: {email: "john.doe@example.com", source: "footer"}
      expect(response).to be_successful
    end

    it "returns a well formatted error response when Mailchimp API error" do
      error = MailchimpMarketing::ApiError.new(
        status: 400,
        response_body: "{\"title\":\"Member Exists\",\"status\":400,\"detail\":\"agnieszka.figiel@vizzuality.com is already a list member. Use PUT to insert or update list members.\",\"instance\":\"89bebe1b-5ca5-7094-c05d-17b8bc758537\"}"
      )
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member).and_raise(error)
      post :create, params: {email: "john.doe@example.com", source: "footer"}
      expect(response.status).to eq(400)
      expect(JSON.parse(response.body)).to eq({"error" => "Member Exists"})
    end

    it "returns bad request when email not given" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
      post :create, params: {email: "", source: "footer"}
      expect(response).to be_bad_request
    end

    it "returns bad request when source not given" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
      post :create, params: {email: "xxx@example.com", source: ""}
      expect(response).to be_bad_request
    end

    it "returns bad request when source invalid" do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member)
      post :create, params: {email: "xxx@example.com", source: "foobar"}
      expect(response).to be_bad_request
    end
  end
end
