$('#activeTimersTable tbody tr').click(function(){
  console.log("I'm above!");
  $(this).addClass('table-info').siblings().removeClass('table-info');
  console.log("I'm below!");
});
