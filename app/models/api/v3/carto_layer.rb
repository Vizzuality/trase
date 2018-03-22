# == Schema Information
#
# Table name: carto_layers
#
#  id                  :integer          not null, primary key
#  contextual_layer_id :integer          not null
#  identifier          :text             not null
#  years               :integer          is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  raster_url          :string
#
# Indexes
#
#  carto_layers_contextual_layer_id_identifier_key  (contextual_layer_id,identifier) UNIQUE
#  index_carto_layers_on_contextual_layer_id        (contextual_layer_id)
#
# Foreign Keys
#
#  fk_rails_...  (contextual_layer_id => contextual_layers.id) ON DELETE => cascade
#

module Api
  module V3
    class CartoLayer < YellowTable
      include Api::V3::StringyArray

      belongs_to :contextual_layer

      validates :contextual_layer, presence: true
      validates :identifier, presence: true, uniqueness: {scope: :contextual_layer}

      stringy_array :years

      def self.yellow_foreign_keys
        [
          {name: :contextual_layer_id, table_class: Api::V3::ContextualLayer}
        ]
      end
    end
  end
end
