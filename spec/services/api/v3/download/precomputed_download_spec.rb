require 'rails_helper'

RSpec.describe Api::V3::Download::PrecomputedDownload do
  describe :clear do
    it "calls cache cleaner" do
      expect(
        Cache::Cleaner
      ).to receive(:clear_cache_for_regexp).twice
      Api::V3::Download::PrecomputedDownload.clear
    end
  end
end
