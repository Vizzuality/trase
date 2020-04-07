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
        resources :nodes, only: [:index]

        get 'actors/:id/basic_attributes', to: 'actors#basic_attributes'
        get 'actors/:id/top_countries', to: 'actors#top_countries'
        get 'actors/:id/top_sources', to: 'actors#top_sources'
        get 'actors/:id/sustainability', to: 'actors#sustainability'
        get 'actors/:id/exporting_companies', to: 'actors#exporting_companies'

        get 'places/:id/basic_attributes', to: 'places#basic_attributes'
        get 'places/:id/top_consumer_actors', to: 'places#top_consumer_actors'
        get 'places/:id/top_consumer_countries', to: 'places#top_consumer_countries'
        get 'places/:id/indicators', to: 'places#indicators'
        get 'places/:id/trajectory_deforestation', to: 'places#trajectory_deforestation'

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

      get 'country_profiles/:id/basic_attributes', to: 'country_profiles#basic_attributes'
      get 'country_profiles/:id/top_consumer_actors', to: 'country_profiles#top_consumer_actors'
      get 'country_profiles/:id/top_consumer_countries', to: 'country_profiles#top_consumer_countries'
      get 'country_profiles/:id/indicators', to: 'country_profiles#indicators'
      get 'country_profiles/:id/trajectory_deforestation', to: 'country_profiles#deforestation_trajectory'
      get 'country_profiles/:id/trajectory_import', to: 'country_profiles#import_trajectory'

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

      get '/contexts/:context_id/nodes/:id/profile_metadata', to: redirect('/api/v3/profiles/%{id}/profile_meta?context_id=%{context_id}')
      namespace :profiles do
        resources :filter_meta, only: [:index]
        get ':id/profile_meta', to: 'profile_meta#show'
      end

      resources :commodities, only: [] do
        get :countries_facts, on: :member
      end
      resources :sankey_card_links, only: [:index]
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
