Rails.application.routes.draw do
  namespace :api do
    namespace :v3 do
      get '/get_contexts', to: 'context#get_contexts'
      get '/get_all_nodes', to: 'nodes#get_all_nodes'
    end
    namespace :v2 do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
      mount Ckeditor::Engine => '/ckeditor'
      devise_for :users, class_name: 'Content::User'
      ActiveAdmin.routes(self)

      get '/posts', to: 'content#posts'
      get '/site_dive/:id', to: 'content#site_dive'
      get '/tweets', to: 'content#tweets'

      resources :geo_id, only: :index
      resources :download, only: [:index], as: :download
      resources :indicators, only: [:index]
      resources :newsletter_subscriptions, only: [:create]

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
  end
end
