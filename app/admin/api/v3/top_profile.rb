ActiveAdmin.register Api::V3::TopProfile, as: 'Top Profile' do
  belongs_to :context, class_name: 'Api::V3::Context'
  permit_params :context_id, :node_id, :top_profile_image_id
  config.filters = false

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/top_profiles')
    end

    def create
      super do |success, _failure|
        success.html { redirect_to edit_admin_context_top_profile_path(resource.context_id, resource.id) }
      end
    end

    def update
      top_profile_image_id = params[:resource][:top_profile_image_id].to_i
      resource.top_profile_image_id = top_profile_image_id
      resource.save
      super do |success, _failure|
        success.html { redirect_to admin_context_top_profiles_path(parent) }
      end
    end
  end

  index do
    column('Node name') { |property| property&.node&.name }
    column('Node type') { |property| property&.node&.node_type }
    column('Image') do |property|
      if property.top_profile_image.nil?
        'No image assigned'
      else
        image_tag property&.top_profile_image&.image_url(:small)
      end
    end
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
    if params[:action] == 'edit'
      available_top_profile_images =
        Api::V3::TopProfileImage.includes(:top_profiles).where(
          commodity_id: resource.context.commodity_id,
          profile_type: resource.profile_type
        )
      render partial: 'admin/form_select_top_profile_images', locals: {
        available_top_profile_images: available_top_profile_images,
        top_profile_image_id: resource.top_profile_image_id,
        node_name: resource.node.name,
        node_type: resource.node.node_type.name,
        commodity: resource.context.commodity.name,
        profile_type: resource.profile_type
      }
    else
      inputs do
        input :node, as: :select, required: true,
                     collection: available_nodes
        f.actions
      end
    end
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
