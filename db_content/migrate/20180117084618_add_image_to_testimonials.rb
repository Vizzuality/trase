class AddImageToTestimonials < ActiveRecord::Migration[5.1]
  def connection
    Content::Testimonial.connection
  end

  def self.up
    change_table :testimonials do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :testimonials, :image
  end
end
