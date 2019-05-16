function fbthanks_modal() {
	$('<div class="atc-modal"><div class=modal-dialog><div class="modal-content vcenter"><div class=modal-header><small>EMAIL US</small><button type="button" class="close" data-dismiss="modal">&times;</button></div><h2>Thank you for the feedback!</h2></div></div></div>').modal();
}

function thanks_modal() {
    ga('send', 'pageview', '/newsletter/thank-you');
      $('<div class="atc-modal"><div class=modal-dialog><div class="modal-content vcenter"><div class=modal-header><small>SIGN UP</small><button type="button" class="close" data-dismiss="modal">&times;</button></div><h2>Thank you for signing up!</h2></div></div></div>').modal();
}

$('body').on('submit', '.signup', function () {
    $(this).parent().removeClass('has-error');
    $(this).parent().find('p.error').remove();
    if(!/.*@.*[.].*/.test( $('.signup input:eq(0)').val() ) ) {
      $(this).parent().addClass('has-error').prepend('<p class="error">Please enter a valid email address.</p>');
      return false;
    }
  
  
  
      $.post('/newsletter/' + encodeURIComponent($('.signup input:eq(0)').val()), null, thanks_modal , "json" );
    return false;
  });

function feedback_modal(title, ref) {
    if(!title) title = 'EMAIL US';
    if(!ref) ref = 'Unknown';
      $('<div class="fb-modal atc-modal"><div class=modal-dialog><div class=modal-content style="text-align:left"><div class=modal-header><small>'+title+'</small><button type="button" class="close" data-dismiss="modal">&times;</button></div><form id=theform><div><label>Your Email Address</label><input name="email" id="email" type="email"></div><div><label>FEEDBACK</label><textarea class="form-control"></textarea></div><a href="#" class="button btn-go btn-goforward" id="fbsubmit">Send</a></form></div></div></div>').modal();
  
      ga('send', 'event', 'Feedback' , 'Open', location.href);
      $('#fbsubmit').click(function() {
          ga('send', 'event', 'Feedback' , 'Submit', location.href);
          $.post( '/feedback', { 'body': $('.atc-modal textarea').val(), 'title': 'from ' + $('.atc-modal input').val(), 'uri': location.href, 'ref': ref  }, function() {}, "json" );
          $('.atc-modal.in').modal('hide');
          fbthanks_modal();
      });
    return false;
  }
  $('body').on('click', '.footer .feedback, .sendfeedback', function (e) { e.preventDefault(); return feedback_modal('EMAIL US', 'Coherence Map Send Feedback'); });

  
window.startModal = function() {
    $('body').append('<div class=modal-backdrop>').find('.modal-backdrop').css({
      position:'fixed',
      top:0,
      left:0,
      right:0,
      bottom:0,
      zIndex: 90001,
      background: 'rgba(0,0,0,0.5)'
    }).hide().fadeIn();
    $('.modal-backdrop').click(function(){$('.modal-backdrop, .atc-modal').remove(); $('.fbflyout').addClass('modal');});
  }
  
  $.fn.modal = function(e) {
    if(e === 'hide') { $('.modal-backdrop').click(); return; }
    startModal();
    $('body').append(this);
    $('.atc-modal').css({
      position:'fixed',
      top:'calc(50% - 250px)',
      left:'calc(50% - 280px)',
      right:'calc(50% - 280px)',
      padding: '30px',
      textAlign: 'center',
      fontFamily: 'MuseoSans-300',
      zIndex: 90002,
      background: 'white'
    });
    //if($('.modal').height() > innerHeight/2 - 20) $('.modal').css({'bottom': '60px', 'overflow': 'auto'});
    if(innerWidth < 560) $('.atc-modal').css({'left': '20px', 'right': '20px', padding:'20px'});
  
    $(window).on('resize.modal-resize', function() {
      if($('.modal-scroll *').length)
       {
         var h = Math.min($('.modal-scroll')[0].scrollHeight + 170, innerHeight - 280);
         $('.atc-modal').css('height', h);
         $('.atc-modal').css('top', innerHeight / 2 - 0.5*h);
       }
       else
       $('.atc-modal').css('top', innerHeight / 2 - 0.5*$('.atc-modal').outerHeight());
    });
  
    setTimeout(function() {
      $(window).trigger('resize.modal-resize');
    }, 10);
  
   }
   $('body').on('click', '.close[data-dismiss]', function() { $('.modal-backdrop').click(); $(window).off('resize.modal-resize'); });
  
  