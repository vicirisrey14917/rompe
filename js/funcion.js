//JavaScript Document
	$(function() {
			
			var tileSize,
				numTiles,
				tilesArray,
				emptyGx,
				emptyGy,
				imageUrl;
				
			var phoneObject = function() {
				var ready = false;
				document.addEventListener("deviceready", function() {
					ready = true;
				}, false);
				return {
					beep: function(n) {
						if(ready) {
							navigator.notification.beep(n);
						}
					},
					vibrate: function(n) {
						if(ready) {
							navigator.notification.vibrate(n);
						}
					}
				}
			}();
			
			
			
			var tileObj = function (gx, gy) {
				
				
				var solvedGx = gx,
					solvedGy = gy,
					
					left = gx * tileSize,
					top = gy * tileSize,
					$tile = $("<div class='tile'></div>"),
					
					that = {
						$element: $tile,
						gx: gx,
						gy: gy,
						
						
						
						
						move: function (ngx, ngy, animate) {
							that.gx = ngx;
							that.gy = ngy;
							tilesArray[ngy][ngx] = that;
							if (animate) {
								$tile.animate({
									left: ngx * tileSize,
									top: ngy * tileSize
								}, 250);
							} else {
								$tile.css({
									left: ngx * tileSize,
									top: ngy * tileSize
								});
							}
						},
						
						
						checkSolved: function () {
							if (that.gx !== solvedGx || that.gy !== solvedGy) {
								return false;
							}
							return true;
						}
					};
					
				$tile.css({
					left: gx * tileSize + 'px',
					top: gy * tileSize + 'px',
					width: tileSize - 2 + 'px',
					height: tileSize - 2 + 'px',
					backgroundPosition: -left + 'px ' + -top + 'px',
					backgroundImage: 'url(' + imageUrl + ')'
				});
				
				
				$tile.data('tileObj', that);
				
				
				return that;
			};
			
			
			
			var checkSolved = function () {
				var gy, gx;
				for (gy = 0; gy < numTiles; gy++) {
					for (gx = 0; gx < numTiles; gx++) {
						if (!tilesArray[gy][gx].checkSolved()) {
							return false;
						}
					}
				}
				return true;
			};
			
			
			
			
			var moveTiles = function (tile, animate) {
				var clickPos, x, y, dir, t;
				
				
				if (tile.gy === emptyGy) {
					clickPos = tile.gx;
					dir = tile.gx < emptyGx ? 1 : -1;
					for (x = emptyGx - dir; x !== clickPos - dir; x -= dir) {
						t = tilesArray[tile.gy][x];
						t.move(x + dir, tile.gy, animate);
					}
					
					emptyGx = clickPos;
				}
				
				
				if (tile.gx === emptyGx) {
					clickPos = tile.gy;
					dir = tile.gy < emptyGy ? 1 : -1;
					for (y = emptyGy - dir; y !== clickPos - dir; y -= dir) {
						t = tilesArray[y][tile.gx];
						t.move(tile.gx, y + dir, animate);
					}
					
					emptyGy = clickPos;
				}
			};
			
	
			
			
			var shuffle = function () {
				var randIndex = Math.floor(Math.random() * (numTiles - 1));
				if (Math.floor(Math.random() * 2)) {
					moveTiles(tilesArray[emptyGx][(emptyGy + 1 + randIndex) % numTiles], false);
				} else {
					moveTiles(tilesArray[(emptyGx + 1 + randIndex) % numTiles][emptyGy], false);
				}
			};
			
			
			
			var setup = function () {
				var x, y, i;
				imageUrl = $("input[name='pic-choice']:checked").val();
				
				
				$('#pic-guide').css({
					opacity: 0.2,
					backgroundImage: 'url(' + imageUrl + ')'
				});
				
				$('#well-done-image').attr("src", imageUrl);
				
				$('.tile', $('#pic-frame')).remove();
				
				numTiles = $('#difficulty').val();
				tileSize = Math.ceil(280 / numTiles);
				emptyGx = emptyGy = numTiles - 1;
				tilesArray = [];
				for (y = 0; y < numTiles; y++) {
					tilesArray[y] = [];
					for (x = 0; x < numTiles; x++) {
						if (x === numTiles - 1 && y === numTiles - 1) {
							break;
						}
						var tile = tileObj(x, y);
						tilesArray[y][x] = tile;
						$('#pic-frame').append(tile.$element);
					}
				}
				
				for (i = 0; i < 100; i++) {
					shuffle();
				}
			};
			
			var bindEvents = function () {
				
				$('#pic-frame').bind('tap',function(evt) {
					var $targ = $(evt.target);
					
					if (!$targ.hasClass('tile')) return;
					
					moveTiles($targ.data('tileObj'),true);
					
					if (checkSolved()) {
						
						phoneObject.beep(1);
						phoneObject.vibrate(500);
						
						$.mobile.changePage("#well-done","pop");
					}
				});
				
				$('#play-button').bind('click',setup);
			};
			bindEvents();
			setup();
	});