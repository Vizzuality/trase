ActiveAdmin.register Api::V3::TopProfile, as: 'Top Profile' do
  belongs_to :context, class_name: 'Api::V3::Context'
  permit_params :context_id, :node_id
  config.filters = false

  # before creating add summary, year and profile_type to top profile record
  before_create :derive_top_profile_details
  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/top_profiles')
    end

    def create
      super do |success, _failure|
        success.html { redirect_to admin_context_top_profiles_path(parent) }
      end
    end

    def update
      super do |success, _failure|
        success.html { redirect_to admin_context_top_profiles_path(parent) }
      end
    end

    def derive_top_profile_details(top_profile)
      Api::V3::TopProfiles::DeriveTopProfileDetails.call(top_profile)
    end
  end

  index do
    column('Node name') { |property| property&.node&.name }
    column('Node type') { |property| property&.node&.node_type }
    actions
  end

  form do |f|
    context_id = params[:context_id].to_i
    profiles_for_specified_context =
      Api::V3::Profile.joins(:context_node_type).where(context_node_types: {context_id: context_id})
    node_type_ids = profiles_for_specified_context.pluck(:node_type_id)
    node_type_names = Api::V3::NodeType.where(id: node_type_ids).pluck(:name)
    available_nodes = Api::V3::Readonly::Node.
      where(context_id: context_id, node_type: node_type_names).
      select_options

    f.semantic_errors
    inputs do
      input :node, as: :select, required: true,
                   collection: available_nodes
    end
    f.actions
  end

  show do
    attributes_table do
      row('Country') { |property| property&.context&.country&.name }
      row('Commodity') { |property| property&.context&.commodity&.name }
      row('Node name') { |property| property&.node&.name }
      row('Node type') { |property| property&.node&.node_type }
      row('Profile type') { |property| property&.profile_type }
      row('Year') { |property| property&.year }
      row('Summary') { |property| property&.summary }
    end
  end
end
