Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :download, only: [:index], as: :download
  resources :indicators, only: [:index]
  resources :newsletter_subscriptions, only: [:create]

  get '/get_map_base_data', to: 'map#index'
  get '/get_linked_geoids', to: 'geo_id#index'
  get '/get_columns', to: 'structure#get_columns'
  get '/get_contexts', to: 'structure#get_contexts'
  get '/get_all_nodes', to: 'nodes#get_all_nodes'
  get '/get_place_node_attributes', to: 'place_factsheet#place_data'
  get '/get_actor_node_attributes', to: 'actor_factsheet#actor_data'
end
