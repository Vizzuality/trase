#= require active_admin/base
#= require activeadmin_addons/all
#= require ckeditor/basepath.js
#= require activeadmin_sortable_table
#= require best_in_place
#= require jquery.purr
#= require best_in_place.purr

$(document).ready ->
  jQuery(".best_in_place").best_in_place()
