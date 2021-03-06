;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "treehouseBadges",
				defaults = {
				username: false,
				reverse: false,
				sortBadgesBy: 'course'
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			
			init: function () {

					this.displayBadges();
			},

			sortBy: function(field, reverse, primer) {

				var key = primer ?
					function(x) {
						return primer(x[field]);
					} :
					function(x) {
						return x[field];
					};

				reverse = !reverse ? 1 : -1;

				return function(a, b) {
					return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
				};
			},

			/** @function getCourseTitleFromBadge
			 * Returns the course title from the badge. Used for badge sorting.
			 * @param {object} badge - The current badge gets passed through.
			 */
			getCourseTitleFromBadge: function(badge) {
					return badge.courses[0].title.toLowerCase();
			},


			/** @function sortBadges
		 	 * Sorts the array of Treehouse Badges that gets passed through it.
		 	 * @param {array} badgesArray - An array of Treehouse Badge objects.
		 	 * @param {string} sortBadgesBy - Valid options: 'course', 'id', or 'date'.
		 	 * @param {boolean} reverseOrder - Default
		 	 */
			sortBadges: function(badgesArray, sortBadgesBy, reverse) {
				var badges = badgesArray;
				var _this = this;

				/* Sort badges by course */
				if (sortBadgesBy === 'course') {
					
					badges.sort(function(a, b) {
						if (_this.getCourseTitleFromBadge(a) < _this.getCourseTitleFromBadge(b)) {
							return -1;
						} else if (_this.getCourseTitleFromBadge(a) > _this.getCourseTitleFromBadge(b)) {
							return 1;
						} else {
							return 0;
						}
					});

				} else if (sortBadgesBy === 'id') {

					// SORT BADGES BY ID
					badges.sort(this.sortBy('id', false, parseInt));

				} else if (sortBadgesBy === 'date') {
					// DO NOTHING
				} else {
					console.log('Invalid sort method. Use course, date, or id');
				}

				if (reverse === true) {
					badges.reverse();
				}

				return badges;
			},

			displayBadges: function() {
				var _this = this;
				var s = this.settings;
				var appendElement = this.element;
				var badgesArray = [];
				var $badgesContainer = $('<div class="badges"></div>');
				var jsonURL = 'http://teamtreehouse.com/' + s.username + '.json';
				var reverse = s.reverse;
				var badgeSort = s.sortBadgesBy;
				var $badge;

				if (s.username === false) {
					console.log('Treehouse Badges Error: No username set in the options.');
					return;
				}
				
				// GET THE JSON FROM TREEHOUSE
				$.getJSON(jsonURL, function(data) {

					// INITIALIZE BADGE VARIABLES
					var fullName = data.name;
					badgesArray = data.badges;
					var badgeName,
						badgeCourse,
						badgeIcon;

					$(appendElement).first().append($badgesContainer);
					$(appendElement).first().prepend('<div class="badges__header"><h1>' + fullName + '\'s Team Treehouse Badges</h1></div>');

					// DELETE BADGES THAT HAVE NO COURSE ATTACHED TO THEM 
					// THE NEWBIE BADGE IS THE ONLY ONE TO MY KNOWLEDGE
					badgesArray = badgesArray.filter(function(badge){
						return badge.courses.length !== 0;
					});

					// SORT BADGES
					badgesArray = _this.sortBadges(badgesArray, badgeSort, reverse);

					for (var i = 0; i < badgesArray.length; i++) {
						var thisBadge = badgesArray[i];
						
						// GRAB THE FIRST COURSE'S NAME AND SET THE HTML TO APPEND TO PAGE
						badgeCourse = '<h3>' + thisBadge.courses[0].title + '</h3>';
							
						// STORE THE REST OF THE HTML TO APPEND TO THE BODY
						badgeName = '<h2><a href="' + thisBadge.url + '">' + thisBadge.name + '</a></h2>';
						badgeIcon = '<img src="' + thisBadge.icon_url + '" alt="" />';
						$badge = $('<div class="badges__badge"><div class="badge__inner">' + badgeIcon + badgeName + badgeCourse + '</div></div>');

						// APPEND THIS BADGE TO THE PAGE CONTAINER
						$badgesContainer.append($badge);
					}
				});
			}


		});

		// A REALLY LIGHTWEIGHT PLUGIN WRAPPER AROUND THE CONSTRUCTOR,
		// PREVENTING AGAINST MULTIPLE INSTANTIATIONS
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );

//# sourceMappingURL=jquery.treehouse-badges.js.map