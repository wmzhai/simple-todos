if (Meteor.isClient) {

  Template.body.helpers({
    tasks: [
      { text : "This is task 1"},
      { text : "This is task 2"},
      { text : "This is task 3"}
    ]

  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
