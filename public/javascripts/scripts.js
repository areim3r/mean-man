jQuery(document).ready(function($){



	/* - = - = - = - = - = - = - =- = = - =- = = - =- =

	    Format Tweets with links 

	- = - = - = - = - = - = - = - = - = = - =- = = - =- = */
	function format_tweet(text){
		// Take standard tweet text and format links to be clickable
		text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(i){
			var url = i.link(i);
			return url;
		});
		
		// Take mentions from twitter text and make them clickable
		text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(i){
			var item = i.replace("@", '');
			var url = i.link('http://twitter.com/' + item);
			return url;
		});

		/*  */
		// Format hashtags
		text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(i){
			var item = i.replace("#", '');
			var url = i.link('http://twitter.com/#' + item);
			return url;
		});

		return text;
	}

	/* - = - = - = - = - = - = - =- = = - =- = = - =- =

	    Format all the tweets

	- = - = - = - = - = - = - = - = - = = - =- = = - =- = */
	// Take tweet text and create links where applicable
	$('.a-tweet .the-text').each(function(){
		var the_text = $(this).html();

		$(this).html(format_tweet(the_text));

		console.log(format_tweet(the_text));

		console.log('tweet found');


	});

	/* - = - = - = - = - = - = - =- = = - =- = = - =- =  - =- = = - =- = = - =- =  - =- = = - =- = = - =- =

	    Take newly created links in tweet text, and make them all open in a new window

	- = - = - = - = - = - = - = - = - = = - =- = - =- = = - =- = = - =- =  - =- = = - =- = = - =- = = - =- = */
	$('.a-tweet .the-text a').each(function(){
		$(this).attr('target', '_blank');
	});


    /* - = - = - = - = - = - = - =- = = - =- = = - =- =  - =- = = - =- = = - =- =  - =- = = - =- = = - =- =

	    script from layout.jade file

	- = - = - = - = - = - = - = - = - = = - =- = - =- = = - =- = = - =- =  - =- = = - =- = = - =- = = - =- = */
                $('.toggle-btn').on('click', function(){

                    $('#buddy-list .collapser').removeClass('slide-down');
                    $('#buddy-list .title-row').removeClass('active');

                    $('#buddy-list').toggleClass('active');

                    if($('#buddy-list').hasClass('active')){
                        $('#m').focus();
                    }

                });

                var title_rows = $('#buddy-list .title-row'),
                    collapsers = $('#buddy-list .collapser');

                $('#buddy-list .title-row').on('click', function(){

                    var list_num = $(this).data('list-num');

                    if($(this).hasClass('active')){
                        $(this).removeClass('active');
                        $('.collapser[data-list-num="'+list_num+'"]').removeClass('slide-down');
                    } else {
                        title_rows.removeClass('active');
                        collapsers.removeClass('slide-down');
                        $(this).addClass('active');
                        $('.collapser[data-list-num="'+list_num+'"]').addClass('slide-down');
                    }



                });

                var window_height = $(window).height();
                var bl_height = window_height+ 172;
                var sp_height = bl_height - 200;
                var global_chat_panel = $('.chat-wrapper.global');

                var adjust_buddy_heights = function(){
                    window_height = $(window).height();
                    bl_height = window_height+ 172;
                    sp_height = bl_height - 200;
                    $('#buddy-list').css('height', bl_height);
                    $('.buddy-list-inner').css('height', bl_height);
                }

                adjust_buddy_heights();

                $(window).on('resize', function(){
                    adjust_buddy_heights();

                });

                $('#socketsForm').on('submit', function(){

                    var the_panel = global_chat_panel.find('.collapser');

                    if(!the_panel.hasClass('slide-down')){
                        the_panel.addClass('slide-down');
                        global_chat_panel.find('title-row').addClass('active');
                    }

                    var messages_height = $('#messages.chat').height();

                    $(".chat-wrapper .inner-scroller").stop().animate({ scrollTop: messages_height });

                });
                //- $('#buddy-list .inner-scroller').css('height', sp_height)

});



// remove facebook url hash
(function removeFacebookAppendedHash() {
  if (!window.location.hash || window.location.hash !== '#_=_')
    return;
  if (window.history && window.history.replaceState)
    return window.history.replaceState("", document.title, window.location.pathname);
  // Prevent scrolling by storing the page's current scroll offset
  var scroll = {
    top: document.body.scrollTop,
    left: document.body.scrollLeft
  };
  window.location.hash = "";
  // Restore the scroll offset, should be flicker free
  document.body.scrollTop = scroll.top;
  document.body.scrollLeft = scroll.left;
}());
