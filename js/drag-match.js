Array.prototype.shuffle = function() {
  var i = this.length, j, tempi, tempj;
  if ( i == 0 ) return false;
  while ( --i ) {
     j       = Math.floor( Math.random() * ( i + 1 ) );
     tempi   = this[i];
     tempj   = this[j];
     this[i] = tempj;
     this[j] = tempi;
  }
  return this;
}

var do_dragmatch = function( data, items_el, targets_el ) {
	data.shuffle(); 
	items_el.css('display', 'block');
	items_el.css('text-align', 'center');
	items_el.css('clear', 'both');
	items_el.css('width', window.innerWidth+'px');
	items_el.css('height', parseInt(window.innerHeight / 2)+'px');
	targets_el.css('display', 'block');
	targets_el.css('text-align', 'center');
	targets_el.css('clear', 'both');
	targets_el.css('width', window.innerWidth+'px');
	targets_el.css('height', parseInt(window.innerHeight / 2)+'px');
	
	var completed = 0;
		
	var yeay = new Media("/android_asset/www/drag-match/audio/yeay.mp3",
	        function() {
	            //alert("playAudio():Audio Success");
	        },
	            function(err) {
	                alert(JSON.stringify(err));
	        });

	var pling = new Media("/android_asset/www/drag-match/audio/pling.mp3",
	        function() {
	            //alert("playAudio():Audio Success");
	        },
	            function(err) {
	                alert(JSON.stringify(err));
	        });
	
	
	for(var x = 0; x < data.length; x++){
		items_el.append( '<div style="display: inline; z-index:20; float: left; height:'+data[x].height+'px; width: '+data[x].width+'px; background-image: url('+data[x].item+');" class="draggable item-'+data[x].name+'"></div>' );
	}
	
	data.shuffle();
	for(var x = 0; x < data.length; x++){
		targets_el.append( '<div data-name="'+ data[x].name+'" style="display: inline; z-index:15; float: left; height:'+data[x].height+'px; width: '+data[x].width+'px; background-image: url('+data[x].target+');" class="droppable target-'+data[x].name+'"></div>' );
		$('.target-'+data[x].name).droppable({ accept:'.item-'+data[x].name,  tolerance: "fit",
			drop: function( event, ui ) {
				pling.play();
				ui.draggable.css('visibility','hidden');
				var new_image = '';
				for(var y = 0; y < data.length; y++){
					if ($(this).attr('data-name') == data[y].name) { new_image = data[y].correct; break; }
				}
				$(this).css('background-image', 'url('+new_image+')').delay(100).fadeIn();
				completed++;
				if (completed == data.length) {
					var lmar = parseInt((window.innerWidth - 500) / 2);
					targets_el.after('<div id="dragmatch-congrats" class="animated hinged fadeInUpBig" style="position: absolute; top: 100px; width: 500px; text-align: center; border-radius: 20px; background-color: #ccc; margin-left:'+lmar+'px"><h1>Congratulations!</h1></div>');
					yeay.play();
				}
			}
		});
	}
	
	for(var x = 0; x < data.length; x++){
		$('.item-'+data[x].name).draggable({ 
			revert:'invalid', snap:'.target-'+data[x].name, snapMode: 'inner', snapTolerance: 50,
			start: function() {
                /* Temporarily revert the transform so drag and dropping works as expected */
                var parentRect = $(this).parent()[0].getBoundingClientRect();
                var rect = this.getBoundingClientRect();
                /* cssBrowserPrefix is one of: -moz -webkit -o */
                $(this).css('-webkit-transition', 'all 0 ease 0');
                $(this).css('transform', 'none');
                $(this).css('left', rect['left']-parentRect['left']);
              }
		});
	}
	
}