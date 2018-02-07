module Content
  class StaffMembersController < ApplicationController
    before_action :set_caching_headers

    def index
      @staff_members = Content::StaffMember.order(:name)
      render json: @staff_members,
             root: 'data',
             each_serializer: Content::StaffMemberSerializer
    end
  end
end
