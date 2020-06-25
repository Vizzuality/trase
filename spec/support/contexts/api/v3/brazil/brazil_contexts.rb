shared_context 'api v3 brazil contexts' do
  include_context 'api v3 brazil country'
  include_context 'api v3 commodities'
  include_context 'api v3 brazil soy context'
  include_context 'api v3 brazil beef context'

  # TODO: aliases, idea is to retire them
  let(:api_v3_context) { api_v3_brazil_soy_context }
  let(:api_v3_context_property) { api_v3_brazil_soy_context_property }
end
