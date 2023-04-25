RSpec.shared_examples "destroys zombies" do
  it "destroys zombieed records" do
    subject.destroy_zombies
    expect(subject.exists?(zombie.id)).to be(false)
  end
  it "does not destroy referenced records" do
    subject.destroy_zombies
    expect(subject.exists?(referenced.id)).to be(true)
  end
end
