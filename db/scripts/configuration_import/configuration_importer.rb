#!/usr/bin/env ruby
require "json"

def create_chart_attribute(chart, chart_attribute_config)
  attrs = [
    "position",
    "years",
    "displayName",
    "legendName",
    "displayType",
    "displayStyle",
    "stateAverage",
    "identifier"
  ]
  create_attrs = chart_attribute_config.slice(*attrs).deep_transform_keys!(&:underscore).merge({chart_id: chart.id})
  Api::V3::ChartAttribute.transaction do
    chart_attribute = Api::V3::ChartAttribute.create(create_attrs)
    if chart_attribute_config["chartInd"]
      ind = Api::V3::Ind.find_by_name(chart_attribute_config.dig("chartInd", "ind", "name"))
      Api::V3::ChartInd.create(ind: ind, chart_attribute: chart_attribute)
    elsif chart_attribute_config["chartQual"]
      qual = Api::V3::Qual.find_by_name(chart_attribute_config.dig("chartQual", "qual", "name"))
      Api::V3::ChartQual.create(qual: qual, chart_attribute: chart_attribute)
    elsif chart_attribute_config["chartQuant"]
      quant = Api::V3::Quant.find_by_name(chart_attribute_config.dig("chartQuant", "quant", "name"))
      Api::V3::ChartQuant.create(quant: quant, chart_attribute: chart_attribute)
    end
  end
end

def create_chart_node_type(chart, chart_node_type_config)
  attrs = ["identifier", "position", "isTotal"]
  node_type = Api::V3::NodeType.find_by_name(chart_node_type_config.dig("nodeType", "name"))
  chart_node_type = Api::V3::ChartNodeType.create(
    chart_node_type_config.slice(*attrs).deep_transform_keys!(&:underscore).merge({chart_id: chart.id, node_type_id: node_type.id})
  )
end

config = JSON.parse(File.open("db/scripts/configuration_import/configuration.json").read)

country_of_destination_node_type = Api::V3::NodeType.find_by(name: "COUNTRY OF DESTINATION")
country_node_type = Api::V3::NodeType.find_by(name: "COUNTRY")

config["contexts"].each do |ctx_config|
  next unless ctx_config["country"]["name"] == "BRAZIL" && ctx_config["commodity"]["name"] == "WOOD PULP"
  ctx_name = "#{ctx_config["commodity"]["name"]} / #{ctx_config["country"]["name"]}"
  Rails.logger.debug "#{ctx_name} Processing configuration"

  cnt_config = ctx_config["contextNodeTypes"].find { |cnt| ["COUNTRY", "COUNTRY OF DESTINATION"].include?(cnt["nodeType"]["name"]) }
  unless cnt_config
    Rails.logger.debug "#{ctx_name} Country profile configuration not found"
    next
  end

  ctx = Api::V3::Readonly::Context.find_by(
    commodity_name: ctx_config["commodity"]["name"],
    country_name: ctx_config["country"]["name"]
  )
  unless ctx
    Rails.logger.debug "#{ctx_name} Context not found"
    next
  end
  Rails.logger.debug "#{ctx_name} Processing context"

  # each context should have 'COUNTRY OF DESTINATION'
  cnt = ctx.context_node_types.find_by(node_type_id: [country_of_destination_node_type.id, country_node_type.id])
  unless cnt
    Rails.logger.debug "#{ctx_name} Context node type not found"
    next
  end

  profile_config = cnt_config["profile"]
  unless profile_config
    Rails.logger.debug "#{ctx_name} Profile configuration not found"
    next
  end

  profile = cnt.profile
  if profile
    Rails.logger.debug "#{ctx_name} Found existing profile #{profile.name} for #{country_of_destination_node_type.name}, aborting"
    next
  end

  Rails.logger.debug "#{ctx_name} Found old configuration for COUNTRY, restoring to COUNTRY OF DESTINATION"

  attrs = [
    "name",
    "mainTopojsonPath",
    "mainTopojsonRoot",
    "adm1Name",
    "adm1TopojsonPath",
    "adm1TopojsonRoot",
    "adm2Name",
    "adm2TopojsonPath",
    "adm2TopojsonRoot"
  ]

  create_attrs = profile_config.slice(*attrs).deep_transform_keys! { |k| k.underscore.sub(/^adm/, "adm_") }.merge({context_node_type_id: cnt.id})
  pp create_attrs
  profile = Api::V3::Profile.new(create_attrs)
  if profile.save
    Rails.logger.debug "#{ctx_name} Created profile"
  else
    pp profile.errors
    next
  end

  profile_config["charts"].each do |chart_config|
    chart_attrs = ["identifier", "title", "position"]
    create_attrs = chart_config.slice(*chart_attrs).merge({profile_id: profile.id})
    chart = Api::V3::Chart.new(create_attrs)
    if chart.save
      Rails.logger.debug "#{ctx_name} Created chart #{chart.title}"
    else
      pp chart.errors
      next
    end
    chart_config["chartAttributes"].each { |chart_attribute_config| create_chart_attribute(chart, chart_attribute_config) }
    chart_config["chartNodeTypes"].each { |chart_node_type_config| create_chart_node_type(chart, chart_node_type_config) }
    chart_config["children"].each do |child_chart_config|
      child_create_attrs = child_chart_config.slice(*chart_attrs).merge({profile_id: profile.id, parent_id: chart.id})
      child_chart = Api::V3::Chart.new(child_create_attrs)
      if child_chart.save
        Rails.logger.debug "#{ctx_name} Created child chart #{child_chart.title}"
      else
        pp child_chart.errors
        next
      end
      child_chart_config["chartAttributes"].each { |chart_attribute_config| create_chart_attribute(child_chart, chart_attribute_config) }
      child_chart_config["chartNodeTypes"].each { |chart_node_type_config| create_chart_node_type(child_chart, chart_node_type_config) }
    end
    false
  end
  false
end
false

config["contexts"].each do |ctx_config|
  ctx_name = "#{ctx_config["commodity"]["name"]} / #{ctx_config["country"]["name"]}"
  # next unless ctx_config['country']['name'] == 'ARGENTINA' && ctx_config['commodity']['name'] == 'SOY'
  Rails.logger.debug "#{ctx_name} Processing configuration"

  ctx_config["contextNodeTypes"].map { |cnt| pp cnt["nodeType"]["name"]; next unless cnt["nodeType"]["name"] == "COUNTRY"; pp cnt["profile"] }

  # cnt_config = ctx_config['contextNodeTypes'].find { |cnt| cnt['nodeType']['name'] == 'COUNTRY' }
  false
end
false


