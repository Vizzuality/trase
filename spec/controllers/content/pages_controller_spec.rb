require 'rails_helper'

RSpec.describe Content::PagesController, type: :controller do
  describe 'GET index' do
    # TODO: merge those databases and make database clearing work again
    before(:each) { Content::Page.delete_all }
    it 'assigns requested page' do
      index = FactoryBot.create(:page, name: 'index')
      get :show, params: {name: 'index'}
      expect(assigns(:page)).to eq(index)
    end
  end
end
