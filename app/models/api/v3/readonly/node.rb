# == Schema Information
#
# Table name: nodes_mv
#
#  id             :integer          primary key
#  main_id        :integer
#  name           :text
#  node_type      :text
#  context_id     :integer
#  profile        :text
#  is_subnational :boolean
#
# Indexes
#
#  nodes_mv_context_id_idx  (context_id)
#  nodes_mv_name_idx        (to_tsvector('simple'::regconfig, COALESCE(name, ''::text)))
#

module Api
  module V3
    module Readonly
      class Node < Api::V3::Readonly::BaseModel
        self.table_name = 'nodes_mv'
        belongs_to :context

        include PgSearch
        pg_search_scope :search_by_name,
                        against: :name,
                        order_within_rank: :name,
                        using: {
                          tsearch: {prefix: true}
                        }
      end
    end
  end
end
