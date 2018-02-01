module Api
  module V3
    class Flow < BlueTable
      belongs_to :context
      has_many :flow_inds
      has_many :flow_quals
      has_many :flow_quants

      def self.import_key
        []
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
