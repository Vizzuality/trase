require 'rails_helper'

RSpec.describe Api::V3::Dashboards::FilterMeta do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil soy goias flows'

  describe 'call' do
    let(:country) { Api::V3::Country.find_by(name: 'BRAZIL') }
    let(:commodity) { Api::V3::Commodity.find_by(name: 'SOY') }
    let(:filter) do
      Api::V3::Dashboards::FilterMeta.new(
        country_ids: [country.id],
        commodity_ids: [commodity.id]
      )
    end
    let(:meta) { filter.call[:data] }

    it 'return sources, companies and destinations tabs' do
      expect(meta).to include(a_hash_including(section: 'SOURCES'))
      expect(meta).to include(a_hash_including(section: 'COMPANIES'))
      expect(meta).to include(a_hash_including(section: 'DESTINATIONS'))
    end

    it 'return prefix on all tabs' do
      %w[SOURCES COMPANIES DESTINATIONS].each do |type|
        meta_type = meta.find { |m| m[:section] == type }
        meta_type[:tabs].each { |tab| expect(tab).to include(:prefix) }
      end
    end

    it 'not include COUNTRY OF PRODUCTION for sources section' do
      meta_type = meta.find { |m| m[:section] == 'SOURCES' }
      expect(meta_type[:tabs].map { |tab| tab[:name] }).not_to include(
        NodeTypeName::COUNTRY_OF_PRODUCTION
      )
    end
  end
end
