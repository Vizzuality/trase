module Api
  module V3
    class DownloadAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      belongs_to :context
      has_one :download_qual, autosave: true
      has_one :download_quant, autosave: true

      validates :context, presence: true
      validates :position, presence: true, uniqueness: {scope: :context}
      validates :display_name, presence: true
      validates_with OneAssociatedAttributeValidator, {
        attributes: [:download_qual, :download_quant]
      }
      validates_with AttributeAssociatedOnceValidator,
        attribute: :download_qual, if: :new_download_qual_given?
      validates_with AttributeAssociatedOnceValidator,
        attribute: :download_quant, if: :new_download_quant_given?

      stringy_array :years
      manage_associated_attributes [:download_qual, :download_quant]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
