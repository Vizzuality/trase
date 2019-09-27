class AddIsQuickFactToResizeByAttributes < ActiveRecord::Migration[5.2]
  def change
    add_column :resize_by_attributes, :is_quick_fact, :boolean, null: false, default: false
    volume = Api::V3::Quant.find_by(name: 'Volume')
    return unless volume

    Api::V3::Context.all.each do |context|
      ra = context.resize_by_attributes.
        includes(:resize_by_quant).
        references(:resize_by_quant).
        find_by('resize_by_quants.quant_id' => volume.id)
      next unless ra

      ra.update_attribute(:is_quick_fact, true)
    end
  end
end
