class CreateTestimonials < ActiveRecord::Migration[5.1]
  def connection
    Content::Testimonial.connection
  end

  def change
    create_table :testimonials do |t|
      t.text :quote
      t.string :author_name
      t.string :author_title

      t.timestamps
    end
  end
end
