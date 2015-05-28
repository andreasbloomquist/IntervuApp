$(function () {

  // $(".form-inline").on("submit", function () {
  //    var valueFromInput = $("#searchAlbum").val();
  //    console.log(valueFromInput);
  //    event.preventDefault();
  // })

  Albums.all();
  View.init();
});


function Albums() {};
Albums.all = function() {
  $.get("/albums", function (res) {
    var albums = JSON.parse(res);
    View.renderAlbums(albums, "album-ul", "album-template");
  })
}

function View() {};
View.init = function() {
  $("#ourForm").on("submit", function (event) {
    event.preventDefault();
    var form = $(".form-control").val();
    console.log(form);
    // View.searchedAlbums(searchQuery);
  })
}

View.renderAlbums = function (items, parentId, templateId) {
  var templateHTML = $("#" + templateId).html();
  var compiledTemplate = _.template(templateHTML);
  var renderedTemplate = compiledTemplate({collection: items});
  $("#" + parentId).html(renderedTemplate);
};

View.renderInterviews = function (items, parentId, templateId) {
  var templateHTML = $("#" + templateId).html();
  var compiledTemplate = _.template(templateHTML);
  var renderedTemplate = compiledTemplate({collection: items});
  $("#" + parentId).html(renderedTemplate);
};

View.searchedAlbums = function (phrase) {
  console.log(phrase);
  // $.ajax({
  //   url: '/search/' + phrase,
  //   type: 'GET',
  //   success: function(res) {
  //     View.renderInterviews(interviews, "album-ul", "interview-template");
  //   }
  // })
}



//ajax from catchphrase.ly
function Interviews() {};
Interviews.add = function (event) {
  var interviewId = $(event.target).closest(".list-album-item").data().id;
  //interviewId is working
  $.ajax({
    url: '/activities/' + interviewId,
    type: 'GET',
    success: function(res) {
      View.renderInterviews(interviews, "album-ul", "interview-template");
    }
  });
};  
