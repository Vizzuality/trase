module Api
  module V3
    class Node < BaseModel
      belongs_to :node_type
      has_one :node_property
      has_many :node_inds
      has_many :node_quals
      has_many :node_quants

      scope :place_nodes, -> {
        includes(:node_type).where(
          'node_types.name' => Api::V3::NodeType::PLACES
        )
      }

      scope :biomes, -> {
        includes(:node_type).where('node_types.name' => NodeTypeName::BIOME)
      }

      scope :states, -> {
        includes(:node_type).where('node_types.name' => NodeTypeName::STATE)
      }

      def place_quals
        node_quals.
          joins(qual: :qual_property).merge(QualProperty.place_non_temporal).
          select(%w(quals.name node_quals.value))
      end

      def temporal_place_quals(year = nil)
        rel = node_quals.
          joins(qual: :qual_property).merge(QualProperty.place_temporal).
          select(%w(quals.name node_quals.value node_quals.year))
        rel = rel.where('node_quals.year' => year) if year.present?
        rel
      end

      def actor_quals
        node_quals.
          joins(qual: :qual_property).merge(QualProperty.actor_non_temporal).
          select(%w(quals.name node_quals.value node_quals.year))
      end

      def temporal_actor_quals(year = nil)
        rel = node_quals.
          joins(qual: :qual_property).merge(QualProperty.actor_temporal).
          select(%w(quals.name node_quals.value node_quals.year))
        rel = rel.where('node_quals.year' => year) if year.present?
        rel
      end

      def place_quants
        node_quants.
          joins(quant: :quant_property).merge(QuantProperty.place_non_temporal).
          select(%w(quants.name quants.unit node_quants.value))
      end

      def temporal_place_quants(year = nil)
        rel = node_quants.
          joins(quant: :quant_property).merge(QuantProperty.place_temporal).
          select(%w(quants.name quants.unit node_quants.value node_quants.year))
        rel = rel.where('node_quants.year' => year) if year.present?
        rel
      end

      def actor_quants
        node_quants.
          joins(quant: :quant_property).merge(QuantProperty.actor_non_temporal).
          select(%w(quants.name quants.unit node_quants.value))
      end

      def temporal_actor_quants(year = nil)
        rel = node_quants.
          joins(quant: :quant_property).merge(QuantProperty.actor_temporal).
          select(%w(quants.name quants.unit node_quants.value node_quants.year))
        rel = rel.where('node_quants.year' => year) if year.present?
        rel
      end

      def place_inds
        node_inds.
          joins(ind: :ind_property).merge(IndProperty.place_non_temporal).
          select(%w(inds.name inds.unit node_inds.value))
      end

      def temporal_place_inds(year = nil)
        rel = node_inds.
          joins(ind: :ind_property).merge(IndProperty.place_temporal).
          select(%w(inds.name inds.unit node_inds.value node_inds.year))
        rel = rel.where('node_inds.year' => year) if year.present?
        rel
      end

      def actor_inds
        node_inds.
          joins(ind: :ind_property).merge(IndProperty.actor_non_temporal).
          select(%w(inds.name inds.unit node_inds.value))
      end

      def temporal_actor_inds(year = nil)
        rel = node_inds.
          joins(ind: :ind_property).merge(IndProperty.actor_temporal).
          select(%w(inds.name inds.unit node_inds.value node_inds.year))
        rel = rel.where('node_inds.year' => year) if year.present?
        rel
      end
    end
  end
end
