# == Schema Information
#
# Table name: download_attributes
#
#  id                                                                      :integer          not null, primary key
#  context_id                                                              :integer          not null
#  position(Display order in scope of context)                             :integer          not null
#  display_name(Name of attribute for display in downloads)                :text             not null
#  years(Years for which attribute is present; empty (NULL) for all years) :integer          is an Array
#
# Indexes
#
#  download_attributes_context_id_position_key  (context_id,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#
module Api
  module V3
    class DownloadAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes
      include Api::V3::EnsurePositionPresent

      belongs_to :context
      has_one :download_qual, autosave: true
      has_one :download_quant, autosave: true

      validates :context, presence: true
      validates :display_name, presence: true
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:download_qual, :download_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :download_qual, if: :new_download_qual_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :download_quant, if: :new_download_quant_given?

      after_create :set_years

      stringy_array :years
      manage_associated_attributes [:download_qual, :download_quant]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def set_years
        FlowAttributeAvailableYearsUpdateWorker.perform_async(
          self.class.name, id, context_id
        )
      end

      private_class_method def self.active_ids
        Api::V3::DownloadQual.distinct.pluck(:download_attribute_id) +
          Api::V3::DownloadQuant.distinct.pluck(:download_attribute_id)
      end
    end
  end
end
