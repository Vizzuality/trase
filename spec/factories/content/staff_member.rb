FactoryBot.define do
  factory :staff_member, class: "Content::StaffMember" do
    association :staff_group
    sequence(:name) { |n| "Staff Member #{n}" }
    sequence(:position) { |n| n }
    image { File.new("#{Rails.root}/spec/support/fixtures/blank.jpg") }
    bio { "# Bio" }
  end
end
