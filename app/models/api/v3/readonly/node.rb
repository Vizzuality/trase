# == Schema Information
#
# Table name: nodes_mv
#
#  id             :integer          primary key
#  main_id        :integer
#  name           :text
#  name_tsvector  :tsvector
#  node_type      :text
#  context_id     :integer
#  years          :integer          is an Array
#  profile        :text
#  is_subnational :boolean
#  geo_id         :text
#
# Indexes
#
#  nodes_mv_context_id_id_idx  (context_id,id) UNIQUE
#  nodes_mv_context_id_idx     (context_id)
#  nodes_mv_name_tsvector_idx  (name_tsvector) USING gin
#

module Api
  module V3
    module Readonly
      class Node < Api::V3::Readonly::BaseModel
        self.table_name = 'nodes_mv'
        belongs_to :context

        include PgSearch::Model
        pg_search_scope :search_by_name, lambda { |query|
          {
            query: query,
            against: :name,
            using: {
              tsearch: {
                prefix: true,
                tsvector_column: :name_tsvector,
                normalization: 2
              }
            },
            order_within_rank: sanitize_sql_for_order(
              [Arel.sql('levenshtein(name, ?), name'), query]
            )
          }
        }

        def self.select_options
          select(:id, :name, :node_type).order(:name).map do |node|
            ["#{node.name} (#{node.node_type})", node.id]
          end
        end
      end
    end
  end
end
