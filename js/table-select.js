
$('#activeTimersTable tbody tr').click(function(){
  $(this).addClass('bg-success').siblings().removeClass('bg-success');
});
