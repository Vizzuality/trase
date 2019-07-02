#= require active_admin/base
#= require activeadmin_addons/all
#= require ckeditor/basepath.js
#= require ckeditor/init.js
#= require activeadmin_sortable_table
#= require best_in_place
#= require jquery.purr
#= require best_in_place.purr

//= require activeadmin/simplemde/simplemde
//= require activeadmin/simplemde_editor_input

$(document).ready ->
  jQuery(".best_in_place").best_in_place()
