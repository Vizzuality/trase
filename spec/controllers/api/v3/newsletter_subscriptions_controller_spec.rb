require 'rails_helper'

RSpec.describe Api::V3::NewsletterSubscriptionsController, type: :controller do
  describe 'POST create' do
    it 'rescues from Mailchimp API error' do
      allow_any_instance_of(MailchimpMarketing::ListsApi).to receive(:add_list_member).and_raise(MailchimpMarketing::ApiError)
      post :create, params: {email: 'john.doe@example.com'}
      expect(response).to be_successful
    end
  end
end
