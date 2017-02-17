Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :geo_id, only: :index

  get '/get_linked_geoids', to: 'geo_id#index'

end
