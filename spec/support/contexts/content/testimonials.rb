shared_context "testimonials" do
  let!(:testimonial_1) do
    FactoryBot.create(
      :testimonial,
      quote: "Terrible",
      author_name: "Grumpy",
      author_title: "Mr"
    )
  end
end
