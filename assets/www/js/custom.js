if(!window.Stiam){
  var Stiam = {version: '1.0'};
}

Stiam.Panel = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
    button: '',
    data_url: 'left'
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

    var html;
    var dataset = self.dataset();
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

  dataset: function(){
    var self = this;
    if(self.settings.data_url === 'left'){
      return [
        {
          name: 'c4_-tiin--',
          title: 'Ştiinţă',
          on: false,
        },
        {
          name: 'c4_Ultima-or-',
          title: 'Ultima oră',
          on: false,
        },
        {
          name: 'c4_S-n-tate',
          title: 'Sănătate',
          on: false,
        },
        {
          name: 'c4_Sport',
          title: 'Sport',
          on: false,
        },
        {
          name: 'c4_Politic-',
          title: 'Politică',
          on: false,
        }
      ];
    }else{
      return [
        {
          name: 'c5_Adevarul-ro',
          title: 'Adevarul.ro',
          on: false,
        },
        {
          name: 'c5_Bursa-ro',
          title: 'Bursa.ro',
          on: false,
        },
        {
          name: 'c5_Cinemagia-ro',
          title: 'Cinemagia.ro',
          on: false,
        }
      ];
    }
  }
}

Stiam.Listing = function(context, options){
  var self = this;
  self.context = context;
  self.settings = {
  };

  if(options){
    $.extend(self.settings, options);
  }

  return self.initialize();
};

Stiam.Listing.prototype = {
  initialize: function(){
    var self = this;
    var dataset = self.dataset();

    self.col1 = $('.ui-block-a', self.context);
    self.col1.empty();

    self.col2 = $('.ui-block-b', self.context);
    self.col2.empty();

    $.each(dataset, function(idx, item){
      var html ='<a href="#article-page" class="article">';
      if(item.thumbnail){
        html += '<img class="article-thumb" src="' + item.thumbnail + '" />';
      }
      html += '<div class="article-body">';
      html += '<h3>' + item.title + '</h3>';
      html += '<p>' + item.description + '</p>';
      html += '</div>';
      html += '</a>';

      if(idx % 2 === 0){
        $(html).appendTo(self.col1);
      }else{
        $(html).appendTo(self.col2);
      }
    });
  },

  dataset: function(){
    return [
      {
        title: 'Personalitatea prin culori',
        description: 'Lumea este plina de culori. De curand, specialistii au demonstrat, in urma unor studii, ca nu trebuie sa se subestimeze efectul pe care il au culorile asupra personalitatii si starii de spirit a oamenilor. Cercetarile au descoperit ca unele culori pot provoca reactii diferite in cazul a diferiti oameni. O buna intelegere a modului in care culorile interactioneaza cu starea de spirit, va poate ajuta sa decorati casa sau sa alegeti imbracamintea, potrivita pentru a fi mereu intr-o stare de spir...',
        thumbnail: 'http://stiam.ro/revista-presei/sfatulmedicului.ro/sanatate/2013-03-25/personalitatea-prin-culori/image_preview'
      },
      {
        title: 'Semnele reactiei alergice la sapun',
        description: 'O reactie alergica la sapun ar putea cauza o eruptie cutanata de culoare rosie insotita de senzatie de mancarime. Pielea afectata va fi de obicei uscata, iar zona se poate umfla. In cazul in care se vor inhala substantele emanate de unele dintre particulele de sapun, persoana in cauza poate experimenta usoare probleme respiratorii si disconfort ocular.',
        thumbnail: 'http://stiam.ro/revista-presei/sfatulmedicului.ro/sanatate/2013-03-25/semnele-reactiei-alergice-la-sapun/image_preview'
      },
      {
        title: 'Acasă la mine',
        description: 'La mine acasă, la Turnu Măgurele, capitalismul ultimilor douăzeci de ani a adus numai prăpăd. Sărăcie şi disperare. Parcă a trecut&#160; pârjolul prin oraşul atât de drag sufletului meu. Combinatul chimic a...',
        thumbnail: ''
      },
      {
        title: 'Inconjuraţi-vă de verde, căutaţi cu orice preţ sursele de energie vitală!',
        description: 'Iată-ne în plină primăvară, într-o superbă infuzie de clorofilă! Păcat că tabloul este întregit însă, de atmosfera încărcată de anxietate, generată de ultimele scandaluri alimentare: lapte încărcat de aflatoxină, carne toxică, de provenienţă mai mult sau mai puţin cunoscută, dar şi plină de hormoni, legume şi fructe injectate, verdeţuri cu pesticide.',
        thumbnail: 'http://stiam.ro/revista-presei/csid.ro/sanatate/2013-03-25/inconjurati-va-de-verde-cautati/image_preview'
      }
    ]
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
    data_url: 'left'
  });
  context.data('Stiam.Panel', left);

  // Right panel
  context = $('#right-panel');
  var right = new Stiam.Panel(context, {
    button: $('a[href="#right-panel"]'),
    data_url: 'right'
  });
  context.data('Stiam.Panel', right);

  // Listing
  context = $('#body');
  var center = new Stiam.Listing(context, {});
  context.data('Stiam.Listing', center)

});
