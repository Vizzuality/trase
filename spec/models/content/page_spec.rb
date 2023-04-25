require "rails_helper"

RSpec.describe Content::Page, type: :model do
  context "when saving with strange name" do
    it "parameterizes name" do
      page = FactoryBot.create(:page, name: "I'm a 'strange' page name")
      expect(page.reload.name).to eq("i-m-a-strange-page-name")
    end
  end
end
