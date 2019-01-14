RSpec.shared_examples 'destroys widows' do
  it 'destroys widowed records' do
    subject.destroy_widows
    expect(subject.exists?(widow.id)).to be(false)
  end
  it 'does not destroy referenced records' do
    subject.destroy_widows
    expect(subject.exists?(referenced.id)).to be(true)
  end
end
