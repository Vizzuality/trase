Rails.application.routes.draw do
  scope path: 'content' do
    ActiveAdmin.routes(self)
    devise_for :users, ActiveAdmin::Devise.config.merge(class_name: 'Content::User')
    authenticate :user do
      require 'sidekiq/web'
      mount Sidekiq::Web => '/sidekiq'
    end
  end

  namespace :content do
    mount Ckeditor::Engine => '/ckeditor'
    resources :posts, only: [:index]
    resources :site_dives, only: [:show]
    resources :tweets, only: [:index]
    resources :testimonials, only: [:index]
    resources :staff_groups, only: [:index]
    get 'about/:name', controller: :pages, action: :show, defaults: {format: 'md'}
  end

  namespace :api do
    namespace :v3 do
      resources :contexts, only: [:index] do
        resources :map_layers, only: [:index]
        resources :columns, only: [:index]
        resources :flows, only: [:index]
        resources :nodes, only: [:index] do
          get :place, on: :member, controller: :place_nodes, action: :show
          get :actor, on: :member, controller: :actor_nodes, action: :show
        end
        resources :actors, only: [] do
          get :basic_attributes
          get :top_countries
          get :top_sources
          get :sustainability
          get :exporting_companies
        end
        resources :places, only: [] do
          get :basic_attributes
          get :top_consumer_actors
          get :top_consumer_countries
          get :indicators
          get :trajectory_deforestation
        end
        resources :download_attributes, only: [:index]
        namespace :nodes do
          resources :attributes, only: [:index], controller: :nodes_attributes
        end
        resources :download, only: [:index], as: :download
        resources :linked_nodes, only: [:index], controller: :linked_nodes
        resources :top_nodes, only: [:index]
      end
      resources :nodes, only: [] do
        get :search, on: :collection, controller: :nodes_search, action: :index
      end
      resources :newsletter_subscriptions, only: [:create]
      resource :database_validation, controller: :database_validation,
                                     only: [:show]
      namespace :dashboards do
        resources :sources, only: [:index] do
          get :search, on: :collection
        end
        resources :companies, only: [:index] do
          get :search, on: :collection
        end
        resources :destinations, only: [:index] do
          get :search, on: :collection
        end
        resources :commodities, only: [:index] do
          get :search, on: :collection
        end
        resources :countries, only: [:index] do
          get :search, on: :collection
        end
        resources :attributes
      end
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
