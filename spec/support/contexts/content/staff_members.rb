shared_context "staff members" do
  let!(:staff_group_1) do
    FactoryBot.create(
      :staff_group,
      name: "Staff Group 1",
      position: 1
    )
  end
  let!(:staff_member_1) do
    FactoryBot.create(
      :staff_member,
      staff_group: staff_group_1,
      name: "Staff Member 1",
      position: 1
    )
  end
  let!(:staff_member_2) do
    FactoryBot.create(
      :staff_member,
      staff_group: staff_group_1,
      name: "Staff Member 2",
      position: 2
    )
  end
end
