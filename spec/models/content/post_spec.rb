require 'rails_helper'

RSpec.describe Content::Post, type: :model do
  context 'when saving with highlighted flag set' do
    it 'de-highlights previously highlighted post' do
      old_post = FactoryBot.create(:post, highlighted: true)
      FactoryBot.create(:post, highlighted: true)
      expect(old_post.reload).not_to be_highlighted
    end
  end

  context 'when saving with highlighted flag unset' do
    it 'does not de-highlight previously highlighted post' do
      old_post = FactoryBot.create(:post, highlighted: true)
      FactoryBot.create(:post, highlighted: false)
      expect(old_post.reload).to be_highlighted
    end
  end
end
