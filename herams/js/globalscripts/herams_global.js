(function() {

      $('#log').popover({
        container: $('.popover-base'),
        placement: 'bottom',
        content: function() {
            return $('#popover-content').html();
        },
        html:true
      })

})();