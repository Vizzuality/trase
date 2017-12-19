Rails.application.routes.draw do
  namespace :content do
    mount Ckeditor::Engine => '/ckeditor'
    devise_for :users, class_name: 'Content::User'
    ActiveAdmin.routes(self)

    get '/posts', to: 'content#posts'
    get '/site_dive/:id', to: 'content#site_dive'
    get '/tweets', to: 'content#tweets'
  end

  namespace :api do
    namespace :v3 do
      resources :contexts, only: [:index] do
        resources :map_groups, only: [:index]
        resources :columns, only: [:index]
        resources :flows, only: [:index]
        resources :nodes, only: [:index] do
          get :place, on: :member, controller: :place_nodes, action: :show
        end
        resources :download_attributes, only: [:index]
        namespace :nodes do
          resources :attributes, only: [:index], controller: :nodes_attributes
        end
      end
      resources :newsletter_subscriptions, only: [:create]
    end
    namespace :v2 do
      resources :geo_id, only: :index
      resources :download, only: [:index], as: :download
      resources :indicators, only: [:index]
      resources :newsletter_subscriptions, only: [:create]

      # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
      resources :download, only: [:index], as: :download
      resources :indicators, only: [:index]

      get '/get_map_base_data', to: 'map#index'
      get '/get_linked_geoids', to: 'geo_id#index'
      get '/get_columns', to: 'structure#columns'
      get '/get_contexts', to: 'structure#contexts'
      get '/get_all_nodes', to: 'nodes#all_nodes'
      get '/get_place_node_attributes', to: 'place_factsheet#place_data'
      get '/get_actor_node_attributes', to: 'actor_factsheet#actor_data'
      get '/get_node_attributes', to: 'nodes#node_attributes'
    end
  end
end
