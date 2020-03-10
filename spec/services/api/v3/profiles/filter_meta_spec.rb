require 'rails_helper'

RSpec.describe Api::V3::Profiles::FilterMeta do
  include_context 'api v3 indonesia profiles'

  describe 'call' do
    let(:filter) do
      Api::V3::Profiles::FilterMeta.new(
        country_ids: [api_v3_indonesia.id],
        commodity_ids: [api_v3_palm_oil.id]
      )
    end
    let(:meta) { filter.call[:data] }

    it 'return sources, companies and destinations tabs' do
      expect(meta).to include(a_hash_including(section: 'SOURCES'))
      expect(meta).to include(a_hash_including(section: 'COMPANIES'))
      expect(meta).to include(a_hash_including(section: 'DESTINATIONS'))
    end

    it 'return profile_type on all tabs' do
      %w[SOURCES COMPANIES DESTINATIONS].each do |type|
        meta_type = meta.find { |m| m[:section] == type }
        meta_type[:tabs].each { |tab| expect(tab).to include(:profile_type) }
      end
    end

    it 'include COUNTRY OF PRODUCTION for sources section' do
      meta_type = meta.find { |m| m[:section] == 'SOURCES' }
      expect(meta_type[:tabs].map { |tab| tab[:name] }).to include(
        NodeTypeName::COUNTRY_OF_PRODUCTION
      )
    end
  end
end
