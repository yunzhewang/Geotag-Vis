//
// custom drop-down menu

L.Control.Drop_down = L.Control.extend({

  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright',
    placeholder: 'Search...'
  },

  initialize: function (options /*{ data: {...}  }*/) {
    // constructor
    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    var div = L.DomUtil.create('div', 'drop-down-menu');
    div.innerHTML = '<select><option>Please choose city</option><option>New York</option><option>Los Angeles</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
  },

  onRemove: function (map) {
    // when removed
    L.DomEvent.removeListener(this._input, 'keyup', this.keyup, this);
    L.DomEvent.removeListener(form, 'submit', this.submit, this);
  },

  keyup: function(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // do nothing
    } else {
      this.results.innerHTML = '';
      if (this.input.value.length > 2) {
        var value = this.input.value;
        var results = _.take(_.filter(this.options.data, function(x) {
          return x.feature.properties.park.toUpperCase().indexOf(value.toUpperCase()) > -1;
        }).sort(sortParks), 10);
        _.map(results, function(x) {
          var a = L.DomUtil.create('a', 'list-group-item');
          a.href = '';
          a.setAttribute('data-result-name', x.feature.properties.park);
          a.innerHTML = x.feature.properties.park;
          this.results.appendChild(a);
          L.DomEvent.addListener(a, 'click', this.itemSelected, this);
          return a;
        }, this);
      }
    }
  },

  itemSelected: function(e) {
    L.DomEvent.preventDefault(e);
    var elem = e.target;
    var value = elem.innerHTML;
    this.input.value = elem.getAttribute('data-result-name');
    var feature = _.find(this.options.data, function(x) {
      return x.feature.properties.park === this.input.value;
    }, this);
    if (feature) {
      this._map.fitBounds(feature.getBounds());
    }
    this.results.innerHTML = '';
  },

  submit: function(e) {
    L.DomEvent.preventDefault(e);
  }

});


L.control.drop_down = function(id, options) {
  return new L.Control.Drop_down(id, options);
}
