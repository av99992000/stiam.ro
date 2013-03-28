//var SERVER = 'http://192.168.1.103:16551/stiam.ro';
var SERVER = 'http://stiam.ro';

$.fn.rodate = function(options){
  var settings = {};

  var roformat = function(date){
    var now = $('#current-time');
    if(now.length){
      now = new Date(now.text());
    }else{
      now = new Date();
    }
    var past = new Date(date.text());
    var delta = (now-past)/1000;
    if(delta < 0){
      date.text('acum cateva secunde');
      return;
    }
    // Minutes
    if(delta < 120){
      date.text('acum un minut');
      return;
    }
    if(delta < 3300){
      var min = parseInt(delta/60, 10);
      date.text('acum ' + min + ' minute');
      return;
    }
    // Hours
    if(delta < 7200){
      date.text('acum o ora');
      return;
    }
    if(delta < 72000){
      var hours = parseInt(delta / 3600, 10);
      date.text('acum ' + hours + ' ore');
      return;
    }
    // Days
    delta = delta / 3600;
    if(delta < 48){
      date.text('ieri');
      return;
    }
    if(delta < 160){
      var days = parseInt(delta / 24, 10);
      date.text('acum ' + days + ' zile');
      return;
    }
    // Weeks
    if(delta < 336){
      date.text('saptamana trecuta');
      return;
    }
    if(delta < 720){
      var weeks = parseInt(delta/24/7, 10);
      date.text('acum ' + weeks + ' saptamani');
      return;
    }
    // Months
    delta = delta / 24;
    if(delta < 60){
      date.text('acum o luna');
      return;
    }
    if(delta < 360){
      var months = parseInt(delta/30, 10);
      date.text('acum ' + months + ' luni');
      return;
    }
    // Years
    if(delta < 720){
      date.text('acum un an');
      return;
    }
    if(delta>720){
      var years = parseInt(delta/360, 10);
      date.text('acum ' + years + ' ani');
    }
  };

  return this.each(function(){
    if(options){
      $.extend(settings, options);
    }

    var self = $(this);
    roformat(self);
  });
};

if(!window.Stiam){
  var Stiam = {version: '1.0'};
}

Stiam.Panel = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
    button: '',
    section: 'categories',
    server: SERVER + '/revista-presei-romanesti/app.json?callback=?',
    dataset: []
  };

  if(options){
    $.extend(self.settings, options);
  }

  return self.initialize();
};

Stiam.Panel.prototype = {
  initialize: function(){
    var self = this;
    self.changed = false;

    self.context.on( "panelclose", function(evt, ui){
      if(self.changed){
        var count = $('form :checked', self.context).length;
        self.settings.button.find('.ui-btn-text').text(count);
        self.changed = false;
      }
    });

    if(!self.settings.dataset.length){
      self.update();
    }
  },

  update: function(){
    var self = this;
    $.ajax({
      url: self.settings.server,
      dataType: 'jsonp',
      crossDomain: true,
      error: function(jqXHR, textStatus, errorThrown){
        self.error('Eroare. Va rugam verificati conexiunea la internet');
      },
      success: function(data, textStatus, jqXHR){
        var section = data[self.settings.section];
        var cid = section.properties.name;
        self.settings.dataset = [];
        $.each(section.items, function(idx, value){
          self.settings.dataset.push({
            name: cid + '-' + value,
            title: value,
            on: false
          });
        });
        self.reload();
      }
    });
  },

  reload: function(){
    var self = this;
    var html;
    var dataset = self.settings.dataset;
    var fieldset = self.context.find('fieldset');
    fieldset.empty();
    $.each(dataset, function(idx, item){
      html = '<input type="checkbox" name="' + item.name + '" id="' + item.name + '" data-theme="a">';
      html += '<label for="' + item.name + '">' + item.title + '</label>';
      $(html).appendTo(fieldset);
    });

    self.context.find('input[type="checkbox"]').checkboxradio();

    self.context.find('form :input').on('change', function(){
      self.changed = true;
    });
  },

  error: function(message){
    var self = this;
    var fieldset = self.context.find('fieldset');
    fieldset.find('.loading').remove();
    var error = fieldset.find('.error');
    if(!error.length){
      error = $('<div>').addClass('error').appendTo(fieldset);
    }
    error.html(message);
  }
};

Stiam.Listing = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
    server: SERVER + '/revista-presei-romanesti/query.json?callback=?',
    dataset: [],
    properties: {}
  };

  if(options){
    $.extend(self.settings, options);
  }

  return self.initialize();
};

Stiam.Listing.prototype = {
  initialize: function(){
    var self = this;

    self.col1 = $('.ui-block-a', self.context);
    self.col1.empty();

    self.col2 = $('.ui-block-b', self.context);
    self.col2.empty();

    self.col3 = $('.ui-block-c', self.context);
    self.col3.empty();

    self.col4 = $('.ui-block-d', self.context);
    self.col4.empty();

    self.update();
  },

  update: function(){
    var self = this;
    $.ajax({
      url: self.settings.server,
      dataType: 'jsonp',
      crossDomain: true,
      error: function(jqXHR, textStatus, errorThrown){
        self.error('Eroare. Va rugam verificati conexiunea la internet');
      },
      success: function(data, textStatus, jqXHR){
        self.settings.dataset = data.items;
        self.settings.properties = data.properties;
        self.reload();
      }
    });
  },

  reload: function(){
    var self = this;
    $.each(self.settings.dataset, function(idx, item){
      var html ='<a href="#article-page" class="article" data-transition="flip">';
      if(item.thumbnail){
        html += '<img class="article-thumb" src="' + item.thumbnail + '" />';
      }
      html += '<div class="article-body"><div class="article-inner">';
      html += '<h3>' + item.title + '</h3>';
      html += '<div class="documentByLine">';
      html += '<span>' + item.source + ' - </span>';
      html += '<span class="rodate">' + item.date + '</span>';
      html += '</div>';
      html += '<p>' + item.description + '</p>';
      html += '</div></div>';
      html += '</a>';
      html = $(html);

      if(idx % 4 === 0){
        html.appendTo(self.col1);
      }else if (idx % 4 === 1 ){
        html.appendTo(self.col2);
      }else if (idx % 4 === 2){
        html.appendTo(self.col3);
      }else {
        html.appendTo(self.col4);
      }

      html.click(function(){
        self.click($(this), item);
      });
    });

    $('.rodate', self.context).rodate();
  },

  error: function(message){
    var self = this;
    var fieldset = self.context.find('fieldset');
    fieldset.find('.loading').remove();
    var error = fieldset.find('.error');
    if(!error.length){
      error = $('<div>').addClass('error').appendTo(fieldset);
    }
    error.html(message);
  },

  click: function(context, options){
    var self = this;
    var body = $('#article-page').find('#article-details');
    body.empty();
    var html = "<div class='article'>";
    html += '<div class="article-body"><div class="article-inner">';
    html += '<h3>' + options.title + '</h3>';
    html += '<div class="documentByLine">';
    html += '<span>' + options.source + ' - </span>';
    html += '<span class="rodate">' + options.date + '</span>';
    html += '</div>';

    if(options.thumbnail){
      html += '<img class="article-thumb" src="' + options.thumbnail + '" />';
    }

    html += '<p>' + options.description + '</p>';
    html += '</div></div></div>';
    html += '<div class="details article">';
    html += '<img class="loading" src="css/images/ajax-loader-2.gif"/>';
    html += '</div>';
    html = $(html);

    html.appendTo(body);
    $('.rodate', body).rodate();
    self.details(body, options);
  },

  details: function(context, options){
    var self = this;
    var url = options.url + '/diffbot.json?callback=?';
    $.ajax({
      url: url,
      data: {'url': options.original},
      dataType: 'jsonp',
      crossDomain: true,
      error: function(jqXHR, textStatus, errorThrown){
        self.error('Eroare. Va rugam verificati conexiunea la internet');
      },
      success: function(data, textStatus, jqXHR){
        if(data.error){
          self.error(data.error);
        }
        if(!data.text){
          return;
        }
        var text = data.text;
        text = text.replace(/\n/g, '</p><p>');
        var p = jQuery('<p>').html(text);
        context.find('.details').html(p);
      }
    });
  }
};

$( document ).on( "pageinit", "#main-page", function() {
  $('#init-page').remove();

  $( document ).on( "swipeleft swiperight", "#header", function( e ) {
    if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
      if ( e.type === "swipeleft"  ) {
        $( "#right-panel" ).panel( "open" );
      } else if ( e.type === "swiperight" ) {
        $( "#left-panel" ).panel( "open" );
      }
    }
  });

  var context;

  // Left panel
  context = $("#left-panel");
  var left = new Stiam.Panel(context, {
    button: $('a[href="#left-panel"]'),
    section: 'categories'
  });
  context.data('Stiam.Panel', left);

  // Right panel
  context = $('#right-panel');
  var right = new Stiam.Panel(context, {
    button: $('a[href="#right-panel"]'),
    section: 'sources'
  });
  context.data('Stiam.Panel', right);

  // Listing
  context = $('#body');
  var center = new Stiam.Listing(context, {});
  context.data('Stiam.Listing', center);

});
