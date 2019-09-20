module Api
  module V3
    class SankeyCardLink < YellowTable
      validates :link, presence: true
      validates :title, presence: true
    end
  end
end
