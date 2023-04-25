# This is not an editable resource, but useful to define in order to have
# nested resource routes.
ActiveAdmin.register Api::V3::Context, as: "Context" do
  menu label: "Resize / Recolor Attributes", parent: "Sankey & Map", priority: 1

  config.filters = false

  includes [
    :country,
    :commodity,
    :resize_by_attributes,
    :recolor_by_attributes
  ]

  actions :index, :show

  index title: "Resize / Recolor Attributes" do
    column("Country") do |context|
      context&.country&.name
    end
    column("Commodity") do |context|
      context&.commodity&.name
    end
    column "Resize by" do |context|
      link_to "#{context.resize_by_attributes.length} attributes",
              admin_context_resize_by_attributes_path(context)
    end
    column "Recolor by" do |context|
      link_to "#{context.recolor_by_attributes.length} attributes",
              admin_context_recolor_by_attributes_path(context)
    end
    actions
  end

  show title: "Resize / Recolor Attributes" do
    attributes_table do
      row("Country") { |property| property.country&.name }
      row("Commodity") { |property| property.commodity&.name }
      row :created_at
      row("Resize by attributes") { |context| link_to("Resize by attributes", admin_context_resize_by_attributes_path(context)) }
      row("Recolor by attributes") { |context| link_to("Recolor by attributes", admin_context_recolor_by_attributes_path(context)) }
    end
  end

  config.filters = false
end

# Contexts under a second tab - Profiles

ActiveAdmin.register Api::V3::Context, as: "Top Profiles For Context" do
  menu parent: "Profiles", priority: 2

  config.filters = false

  includes [
    :country,
    :commodity,
    :top_profiles
  ]

  actions :index, :show

  controller do
    def scoped_collection
      context_ids = Api::V3::Profile.joins(:context_node_type).where.not(context_node_types: {context_id: nil}).pluck(:context_id)
      Api::V3::Context.where(id: context_ids)
    end
  end

  index do
    column("Country") do |context|
      context&.country&.name
    end
    column("Commodity") do |context|
      context&.commodity&.name
    end
    column "Top profiles" do |context|
      link_to "#{context.top_profiles.length} top profiles",
              admin_context_top_profiles_path(context)
    end
    actions
  end

  show do
    attributes_table do
      row("Country") { |property| property.country&.name }
      row("Commodity") { |property| property.commodity&.name }
      row :created_at
      row("Top profiles") { |property| link_to("Top profiles", admin_context_top_profiles_path(context_id: property.id)) }
    end
  end

  config.filters = false
end
