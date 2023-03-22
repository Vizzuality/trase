FactoryBot.define do
  factory :staff_group, class: "Content::StaffGroup" do
    sequence(:name) { |n| "Staff Group #{n}" }
    sequence(:position) { |n| n }
  end
end
