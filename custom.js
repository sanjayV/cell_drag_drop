$(function() {
	$('.report').draggable( {
		cursor: 'move',
		containment: 'document',
	    helper: myHelper
	});

	$('.column').droppable( {
	    drop: handleDropEvent
	});

	function handleDropEvent( e, ui ) {
		var draggable = ui.draggable;
		console.log(ui.offset.top)
		$(e.target).append(draggable)
		//alert( 'The square with ID "' + draggable.text() + '" was dropped onto me!' );
	}

	function myHelper( e ) {
		var height = $(e.target).height();
		var width = $(e.target).width();
		var clone = $(e.target).clone();
		return clone.height(height).width(width).css('background','#ccc');
		//return '<div id="draggableHelper" style="height:'+height+';width:'+width+';">I am a helper - drag me!</div>';
	}
});