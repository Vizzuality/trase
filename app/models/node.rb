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
  belongs_to :parent, :class_name => 'Node'
  has_many :children, :class_name => 'Node', :foreign_key => :parent_id
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

  def ancestors(ancestors_memo=[])
    return ancestors_memo.push(self) if self.parent.nil?
    parent.ancestors(ancestors_memo.push(self))
  end

  def place_quals
    data = node_quals.
      joins(:qual).
      where('quals.place_factsheet' => true).
      where('place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE').
      select([
        'quals.name',
        'node_quals.value'#,
        # 'node_quals.year'
      ])
    Hash[data.map do |e|
      [e['name'], e]
    end]
  end

  def place_quants
    data = node_quants.
      joins(:quant).
      where('quants.place_factsheet' => true).
      where('place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE').
      select([
        'quants.name',
        # 'quants.unit',
        # 'quants.unit_type',
        # 'quants.frontend_name',
        # 'quants.tooltip_text',
        'node_quants.value'
      ])
    Hash[data.map do |e|
      [e['name'], e]
    end]
  end

  def place_temporal_quants
    node_quants.joins(:quant)# TODO: data update? .where('quants.place_factsheet_temporal' => true)
  end

  def place_inds
    data = node_inds.
      joins(:ind).
      where('inds.place_factsheet' => true).
      where('place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE').
      select([
        'inds.name',
        'node_inds.value'#,
        # 'node_inds.year'
      ])
    Hash[data.map do |e|
      [e['name'], e]
    end]
  end

end
