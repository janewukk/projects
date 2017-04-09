// ============= GLOBAL INITIALIZATION
// config csrf token for jQuery ajax
var csrftoken = Cookies.get('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});
// config csrf token for Axios
axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
window.http = axios;

// activate star animation
var star = $(".star");

star.on('star:toggled', function(event) {
	var status = event.data['status'];
	if (!status) {
		// turn off star
		star.removeClass("starred");
		star.addClass("unstarred");
	} else {
		// turn on star
		star.removeClass("unstarred");
		star.addClass("starred");
	}
});

// init tooltips
$('[data-toggle="tooltip"]').tooltip();

// ============== HELPER FUNCTIONS
/**
 * Requires a modal#modal element present
 * Show a modal with customized message
 * @param  {String} message Message to show
 * @return {Void}
 */
function showModal(message) {
	// set error message
	$('#modal .modal-body').html(message);
	// show modal
	$('#modal').modal();
}

/**
 * Trigger a jquery custom event
 * @param  {jQuery.fn} $el   jQuery obj
 * @param  {String} event Name of event
 * @param  {Object} data  Data to pass into event
 * @return {Void}
 */
function trigger($el, event, data) {
	var eventData = {
		'type' : event
	}
	$el.trigger(Object.assign(eventData, data));
}

// ============== HELPER CLASSES
/**
 * A simple wrapper over the KnockoutJS MVVM
 * @param {Object} options Options to initialize
 */
window.ob = ko.observable;
window.oba = ko.observableArray;
window.obc = ko.computed;

function View(options) {
	// init configs
	var el = null, data = {}, computed = {}, methods = {};

	// extract configurations
	if (options.el) el = options.el;
	if (options.data) data = options.data;
	if (options.computed) computed = options.computed;
	if (options.methods) methods = options.methods;

	// construct internal view model
	this.viewModel = data;
	this.constructData(this.viewModel);
	this.constructComputedData(computed);
	this.constructMethods(methods);

	// activate binding
	if (el) {
		ko.applyBindings(this.viewModel, el);
	} else {
		ko.applyBindings(this.viewModel);
	}
}

/**
 * Shortcut to retrieve the underlining view model
 * @return {Object} View model
 */
View.prototype.data = function() {
	
	return this.viewModel;

};

/**
 * Convert all input data into observables
 * @param  {Object} obj Initial data object
 * @return {Void}
 */
View.prototype.constructData = function (obj) {
	var key, has = Object.prototype.hasOwnProperty.bind(obj);
	for (key in obj) {
		if (has(key)) {
			var val = obj[key];
			if (Array.isArray(val)){
				for (var i = 0; i < val.length; ++i) {
					this.constructData(val[i]);
				}
				obj[key] = oba(val);
			} else {
				obj[key] = ob(val);
			}
		}
	}
}

/**
 * Make computed property functions 
 * @param  {Object} computed Computed properties function mapping
 * @return {Void}
 */
View.prototype.constructComputedData = function (computed) {
	for (var key in computed) {
		this.viewModel[key] = obc(computed[key], this.viewModel)
	}
}

/**
 * Make view specific methods
 * @param  {Object} methods Method function mapping
 * @return {Void}
 */
View.prototype.constructMethods = function (methods) {
	for (var key in methods) {
		this.viewModel[key] = methods[key].bind(this.viewModel);
	}
}