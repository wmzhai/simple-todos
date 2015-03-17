Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Meteor.subscribe("tasks");

  Template.body.helpers({
   tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  // Add to Template.body.helpers
  incompleteCount: function () {
    return Tasks.find({checked: {$ne: true}}).count();
  }  
 });

  Template.body.events({
    "submit .new-task": function (event){
      var text = event.target.text.value;

      Meteor.call("addTask", text)

      //添加以后清空这一行的内容
      event.target.text.value = "";

      //告诉浏览器不需要使用默认的submit处理（会刷新），因为我们已经处理过了这个消息
      //如果取消这一行，浏览器会有一个刷新过程
      return false;
    },

    // Add to Template.body.events
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.helpers({
      isOwner: function () {
        return this.owner === Meteor.userId();
      }
    });


  // In the client code, below everything else
  Template.task.events({
    "click .toggle-checked": function () {
      
      Meteor.call("setChecked", this._id,  !this.checked);

    },
    "click .delete": function () {
      
      Meteor.call("deleteTask", this._id);
    },
    // Add an event for the new button to Template.task.events
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
  });
 

  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}


// At the bottom of simple-todos.js, outside of the client-only block
Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
    // Add a method to Meteor.methods called setPrivate
  setPrivate: function (taskId, setToPrivate) {
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});




if (Meteor.isServer) {
  
  Meteor.publish("tasks",function(){
    return Tasks.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
    });
  })
}
