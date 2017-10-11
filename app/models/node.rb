# == Schema Information
#
# Table name: nodes
#
#  node_id                 :integer          not null, primary key
#  geo_id                  :text
#  main_node_id            :integer
#  name                    :text
#  node_type_id            :integer
#  is_domestic_consumption :boolean
#  is_unknown              :boolean
#

class Node < ActiveRecord::Base

  self.primary_key = :node_id

  belongs_to :node_type, :class_name => 'NodeType', :foreign_key => :node_type_id
  has_many :node_quants, :class_name => 'NodeQuant', :foreign_key => :node_id
  has_many :node_quals, :class_name => 'NodeQual', :foreign_key => :node_id
  has_many :node_inds, :class_name => 'NodeInd', :foreign_key => :node_id

  scope :biomes, -> {
    includes(:node_type).where('node_types.node_type' => NodeTypeName::BIOME)
  }

  scope :states, -> {
    includes(:node_type).where('node_types.node_type' => NodeTypeName::STATE)
  }

  scope :place_nodes, -> {
    includes(:node_type).
    where(
      'node_types.node_type' => [
        NodeTypeName::MUNICIPALITY, NodeTypeName::LOGISTICS_HUB, NodeTypeName::BIOME, NodeTypeName::STATE
      ]
    )
  }

  scope :actor_nodes, -> {
    includes(:node_type).
    where(
      'node_types.node_type' => [
        NodeTypeName::IMPORTER, NodeTypeName::EXPORTER
      ]
    )
  }

  scope :exporters, -> {
    includes(:node_type).
    where(
      'node_types.node_type' => [
        NodeTypeName::EXPORTER
      ]
    )
  }

  def ancestors(ancestors_memo=[])
    return ancestors_memo.push(self) if self.parent.nil?
    parent.ancestors(ancestors_memo.push(self))
  end

  def place_quals
    node_quals.
      joins(:qual).merge(Qual.place_non_temporal).
      select([
        'quals.name',
        'node_quals.value'
      ])
  end

  def temporal_place_quals(year = nil)
    rel = node_quals.
      joins(:qual).merge(Qual.place_temporal).
      select([
        'quals.name',
        'node_quals.value',
        'node_quals.year'
      ])
    if year.present?
      rel = rel.where('node_quals.year' => year)
    end
    rel
  end

  def actor_quals
    node_quals.
      joins(:qual).merge(Quant.actor_non_temporal).
      #where('quals.actor_factsheet' => true).
      select([
        'quals.name',
        'node_quals.value',
        'node_quals.year'
      ])
  end

  def temporal_actor_quals(year = nil)
    rel = node_quals.
      joins(:qual).merge(Quant.actor_temporal).
      #where('quals.actor_factsheet' => true).
      select([
        'quals.name',
        'node_quals.value',
        'node_quals.year'
      ])
    if year.present?
      rel = rel.where('node_quals.year' => year)
    end
    rel
  end

  def place_quants
    data = node_quants.
      joins(:quant).merge(Quant.place_non_temporal).
      select([
        'quants.name',
        'quants.unit',
        'node_quants.value'
      ])
  end

  def temporal_place_quants(year = nil)
    rel = node_quants.
      joins(:quant).merge(Quant.place_temporal).
      select([
        'quants.name',
        'quants.unit',
        'node_quants.value',
        'node_quants.year'
      ])
    if year.present?
      rel = rel.where('node_quants.year' => year)
    end
    rel
  end

  def actor_quants
    node_quants.
      joins(:quant).merge(Quant.actor_non_temporal).
      select([
        'quants.name',
        'quants.unit',
        'node_quants.value'
      ])
  end

  def temporal_actor_quants(year = nil)
    rel = node_quants.
      joins(:quant).merge(Quant.actor_temporal).
      select([
        'quants.name',
        'quants.unit',
        'node_quants.value',
        'node_quants.year'
      ])
    if year.present?
      rel = rel.where('node_quants.year' => year)
    end
    rel
  end

  def place_inds
    data = node_inds.
      joins(:ind).merge(Ind.place_non_temporal).
      select([
        'inds.name',
        'inds.unit',
        'node_inds.value'
      ])
  end

  def temporal_place_inds(year = nil)
    rel = node_inds.
      joins(:ind).merge(Ind.place_temporal).
      select([
        'inds.name',
        'inds.unit',
        'node_inds.value',
        'node_inds.year'
      ])
    if year.present?
      rel = rel.where('node_inds.year' => year)
    end
    rel
  end

  def actor_inds
    node_inds.
      joins(:ind).merge(Quant.actor_non_temporal).
      select([
        'inds.name',
        'inds.unit',
        'node_inds.value'
      ])
  end

  def temporal_actor_inds(year = nil)
    rel = node_inds.
      joins(:ind).merge(Quant.actor_temporal).
      select([
        'inds.name',
        'inds.unit',
        'node_inds.value',
        'node_inds.year'
      ])
    if year.present?
      rel = rel.where('node_inds.year' => year)
    end
    rel
  end

  def same_type_nodes_indicator_values(indicator_type, indicator_name)
    value_table, dict_table = if indicator_type == 'quant'
      ['node_quants', 'quants']
    elsif indicator_type == 'ind'
      ['node_inds', 'inds']
    end
    query = Node.
      where(node_type_id: self.node_type_id).
      joins(value_table => indicator_type).
      where("#{dict_table}.name" => indicator_name)
  end

  def same_type_nodes_in_state_indicator_values(state, indicator_type, indicator_name)
    same_type_nodes_indicator_values(indicator_type, indicator_name).
      joins(node_quals: :qual).
      where('node_quals.value' => state.name, 'quals.name' => 'STATE')
  end

  def flow_values(context, indicator_type, indicator_name)
    node_index = NodeType.node_index_for_id(context, self.node_type_id)
    value_table, dict_table = if indicator_type == 'quant'
      ['flow_quants', 'quants']
    elsif indicator_type == 'ind'
      ['flow_inds', 'inds']
    end
    Flow.
      joins("JOIN #{value_table} ON flows.flow_id = #{value_table}.flow_id").
      joins("JOIN #{dict_table} ON #{dict_table}.#{indicator_type}_id = #{value_table}.#{indicator_type}_id").
      where("#{dict_table}.name" => indicator_name).
      where('path[?] = ?', node_index, self.id).
      where(context_id: context.id)
  end
end
