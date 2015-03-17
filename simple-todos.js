Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.body.helpers({
    tasks: function(){
      //按插入顺序逆序
      return Tasks.find({}, {sort: {createAt : -1}});
    }

 });

  Template.body.events({
    "submit .new-task": function (event){
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createAt: new Date()
      });

      //添加以后清空这一行的内容
      event.target.text.value = "";

      //告诉浏览器不需要使用默认的submit处理（会刷新），因为我们已经处理过了这个消息
      //如果取消这一行，浏览器会有一个刷新过程
      return false;
    }

  }

  )
 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
