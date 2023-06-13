module Content
  class StaffGroupsController < ApplicationController
    before_action :set_caching_headers

    def index
      @staff_groups = Content::StaffGroup
        .includes(:staff_members)
        .references(:staff_members)
        .order(:position, "staff_members.position")
      render json: @staff_groups,
        root: "data",
        each_serializer: Content::StaffGroupSerializer
    end
  end
end
