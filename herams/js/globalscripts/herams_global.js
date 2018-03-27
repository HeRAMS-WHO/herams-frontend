(function() {

      $('#log').popover({
        container: $('.content'),
        placement: 'bottom',
        content: function() {
            return $('#popover-content').html();
        },
        html:true
      })

})();