Rails.application.routes.draw do
  scope path: 'content' do
    ActiveAdmin.routes(self)
    devise_for :users, ActiveAdmin::Devise.config.merge(class_name: 'Content::User')
    authenticate :user do
      require 'sidekiq/web'
      require 'sidekiq_unique_jobs/web'
      mount Sidekiq::Web => '/sidekiq'
    end
  end

  namespace :admin do
    get :source_search, controller: :node_search, action: :source_search
    get :company_search, controller: :node_search, action: :company_search
    get :destination_search, controller: :node_search, action: :destination_search

    resources :commodity_search, only: [:index]
    resources :country_search, only: [:index]
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
      resources :top_profiles, only: [:index]
      resources :contexts, only: [:index] do
        resources :map_layers, only: [:index]
        resources :columns, only: [:index], controller: :node_types
        resources :flows, only: [:index]
        resources :nodes, only: [:index] do
          get :profile_metadata, on: :member, controller: :profile_metadata, action: :index
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
      resources :nodes_stats, only: [:index]
      namespace :dashboards do
        resources :templates, only: [:index]
        resources :sources, only: [:index] do
          get :search, on: :collection
        end
        # TODO: remove once dashboards_companies_mv retired
        resources :companies, only: [:index] do
          get :search, on: :collection
        end
        resources :exporters, only: [:index] do
          get :search, on: :collection
        end
        resources :importers, only: [:index] do
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
        resources :filter_meta, only: [:index]
        namespace :charts do
          resources :single_year_no_ncont_overview, only: [:index]
          resources :single_year_no_ncont_node_type_view, only: [:index]
          resources :single_year_ncont_overview, only: [:index]
          resources :single_year_ncont_node_type_view, only: [:index]
          resources :multi_year_no_ncont_overview, only: [:index]
          resources :multi_year_no_ncont_node_type_view, only: [:index]
          resources :multi_year_ncont_overview, only: [:index]
          resources :single_year_node_values_overview, only: [:index]
          resources :multi_year_node_values_overview, only: [:index]
        end
        resources :parametrised_charts, only: [:index]
      end

      namespace :profiles do
        resources :filter_meta, only: [:index]
      end

      resources :commodities, only: [] do
        get :countries_facts, on: :member
      end
      resources :sankey_card_links, only: [:index]
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

    get '/v3/countries', to: 'public/countries#index'
    get '/v3/commodities', to: 'public/commodities#index'

    namespace :public do
      resources :countries, only: [:index]
      resources :commodities, only: [:index]
      resources :attributes, only: [:index]
      resources :flows, only: [:index]
      resources :nodes, only: [] do
        get :data, on: :member
      end
      namespace :nodes do
        resources :sources, only: [:index]
        resources :exporters, only: [:index]
        resources :importers, only: [:index]
        resources :destinations, only: [:index]
      end
      resources :node_types
    end
  end
end
