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

Stiam.Events = {
  query: 'stiam-query',
  app: 'stiam-app',
  reset: 'stiam-reset'
}

Stiam.Query = {};

Stiam.Panel = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
    button: '',
    server: SERVER + '/revista-presei-romanesti/app.json?callback=?',
    categories: {},
    sources: {}
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
        var items = $('form :checked', self.context);
        var count = items.length;
        self.settings.button.find('.ui-btn-text').text(count);

        Stiam.Query = {};
        $.each(items, function(idx, item){
          var key = $(item).data('key');
          value = $(item).data('value');
          if(!Stiam.Query[key]){
            Stiam.Query[key] = [];
          }
          Stiam.Query[key].push(value);
        });

        $(document).trigger(Stiam.Events.query, Stiam.Query);
        self.changed = false;
      }
    });

    $(document).unbind('.StiamPanel');
    $(document).bind(Stiam.Events.reset + '.StiamPanel', function(evt, data){
      self.reset(data);
    });

    self.update();
  },

  update: function(){
    var self = this;
    $.mobile.showPageLoadingMsg();
    $.ajax({
      url: self.settings.server,
      dataType: 'jsonp',
      crossDomain: true,
      error: function(jqXHR, textStatus, errorThrown){
        self.error('Eroare. Va rugam verificati conexiunea la internet');
      },
      success: function(data, textStatus, jqXHR){
        $.extend(self.settings, data);
        self.updateSection(self.settings.sources);
        self.updateSection(self.settings.categories);
        self.reload();
      },
      complete: function(){
        $.mobile.hidePageLoadingMsg();
      }
    });
  },

  updateSection: function(section){
    var self = this;
    var cid = section.properties.name;
    if(!section.dataset){
      section.dataset = [];
    }
    $.each(section.items, function(idx, value){
      section.dataset.push({
        name: cid + '-' + value,
        title: value,
        on: false
      });
    });
  },

  reload: function(){
    var self = this;
    self.reloadSection(self.settings.sources, 'sources');
    self.reloadSection(self.settings.categories, 'categories');
  },

  reloadSection: function(section, sid){
    var self = this;
    var html;
    var dataset = section.dataset;
    var cid = section.properties.name;
    var fieldset = self.context.find('#' + sid);
    var legend = fieldset.find('legend');
    fieldset.empty();
    legend.appendTo(fieldset);
    $.each(dataset, function(idx, item){
      html = '<input type="checkbox" name="' + item.name + '" id="' + item.name + '" data-value="' + item.title +'" data-key="' + cid + '">';
      html += '<label for="' + item.name + '">' + item.title + '</label>';
      $(html).appendTo(fieldset);
    });

    self.context.find('input[type="checkbox"]').checkboxradio();

    self.context.find('form :input').on('change', function(){
      self.changed = true;
    });
  },

  reset: function(options){
    var self = this;
    var items = $('form :checked', self.context);
    items.attr('checked', false);
    items.checkboxradio('refresh');
    self.changed = true;
    self.context.trigger('panelclose');
  },

  error: function(message){
    $.mobile.showPageLoadingMsg('e', message);
  }
};

Stiam.Listing = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
    server: SERVER + '/revista-presei-romanesti/query.json?callback=?',
    dataset: [],
    properties: {},
    query: {}
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
    self.col2 = $('.ui-block-b', self.context);
    self.col3 = $('.ui-block-c', self.context);
    self.col4 = $('.ui-block-d', self.context);

    self.update(true);

    // Events
    $(document).unbind('.StiamListing');
    $(document).bind(Stiam.Events.query + '.StiamListing', function(evt, data){
      self.settings.query = data || {};
      var refresh = true;
      if(self.settings.query.b_start && self.settings.query.b_start !== 0){
        refresh = false;
      }
      self.update(refresh);
    });
  },

  more: function(){
    var self = this;
    var more = $([
      '<div class="article more-articles">',
        '<div class="article-body">',
          '<div class="article-inner">',
            '<button>Mai multe ştiri</button>',
          '</div>',
        '</div>',
      '</div>'].join('\n'));
    more.appendTo(self.col4);

    $('button', more).button();
    $('button', more).click(function(){
      if(!Stiam.Query.b_start){
        Stiam.Query.b_start = 20;
      }else{
        Stiam.Query.b_start += 20;
      }
      $(document).trigger(Stiam.Events.query, Stiam.Query);
      more.remove();
    });
  },

  refresh: function(){
    var self = this;
    self.col1.empty();
    self.col2.empty();
    self.col3.empty();
    self.col4.empty();
  },

  update: function(refresh){
    var self = this;
    $.mobile.showPageLoadingMsg();
    $.ajax({
      url: self.settings.server,
      dataType: 'jsonp',
      crossDomain: true,
      traditional: true,
      data: self.settings.query,
      error: function(jqXHR, textStatus, errorThrown){
        self.error('Eroare. Va rugam verificati conexiunea la internet');
        alert('Eroare. Va rugam verificati conexiunea la internet');
      },
      success: function(data, textStatus, jqXHR){
        self.settings.dataset = data.items;
        self.settings.properties = data.properties;
        self.reload(refresh);
      },
      complete: function(){
        //alert('jquery.mobile Done');
        $.mobile.hidePageLoadingMsg();
      }
    });
  },

  reload: function(refresh){
    var self = this;

    if(refresh){
      self.refresh();
    }

    $.each(self.settings.dataset, function(idx, item){
      var html ='<a href="#article-page" class="article" data-transition="flow">';
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

    // No results
    if(refresh && !self.settings.dataset.length){
      var html = $([
        '<div class="article">',
          '<div class="article-body"><div class="article-inner">',
          '<h3>Nu exista articole care sa corespunda filtrelor selectate</h3>',
            '<button>Sterge toate filtrele</button>',
        "</div>"].join('\n'));
      html.appendTo(self.col1);
      $('button', html).button();

      $('button', html).click(function(evt){
        $(document).trigger(Stiam.Events.reset);
      });
    }else{
      self.more();
    }
  },

  error: function(message){
    $.mobile.showPageLoadingMsg('e', message);
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
    $.mobile.showPageLoadingMsg();
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
        var p = $('<p>').html(text);
        context.find('.details').html(p);
      },
      complete: function(){
        $.mobile.hidePageLoadingMsg();
      }
    });
  }
};

Stiam.BackToTop = {
  initialize: function(){
    var self = this;
    self.button = $('<div>')
      .attr('id', 'back-top')
      .addClass('back-top')
      .html('sus')
      .hide()
      .appendTo($('body'));

    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        self.button.fadeIn('slow');
      } else {
        self.button.fadeOut('slow');
      }
    });

    self.button.click(function(){
      $('body,html').animate({scrollTop: 0}, 800);
    });
  }
};

Stiam.Refresh = {
  initialize: function(){
    var self = this;
    self.button = $('a[data-icon="refresh"]');
    self.button.click(function(evt){
      evt.preventDefault();
      $(document).trigger(Stiam.Events.query, Stiam.Query);
    });
  }
}

// jQuery mobile init
$( document ).on( "pageinit", "#main-page", function() {
  // Events
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
    button: $('a[href="#left-panel"]')
  });
  context.data('Stiam.Panel', left);

  // Listing
  context = $('#body');
  var center = new Stiam.Listing(context, {});
  context.data('Stiam.Listing', center);

  Stiam.BackToTop.initialize();
  Stiam.Refresh.initialize();

});

// Cordova init
$(document).on("deviceready", function(){
  navigator.splashscreen.hide();

  $(document).on("backbutton", function (){
    // Don't try to exit if the user is not on the homepage
    var back = $('a[data-rel="back"]:visible');
    if(back.length){
      return back.click();
    }

    navigator.notification.confirm(
     'Sunteţi sigur că doriţi să părăsiţi aplicaţia stiam.ro?',
       function(button){
           if(button == "1"){
               navigator.app.exitApp();
           }
       },
       'Ieşire',
       'Da,Nu'
    );
  });

});
