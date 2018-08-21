$(function() {
	
	$('#tags-input').tagsinput({
    confirmKeys: [13, 188]
  });

  $('#tags-input input').on('keypress', function(e){
    if (e.keyCode == 13){
      e.keyCode = 188;
      e.preventDefault();
    };
  });
});