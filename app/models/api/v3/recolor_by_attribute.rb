module Api
  module V3
    class RecolorByAttribute < YellowTable
      belongs_to :context
      has_many :recolor_by_inds
      has_many :recolor_by_quals

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
