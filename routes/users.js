module.exports = index;

var async = require('async');

let { User, Study } = require('../DB/User');
var random_string = require('randomstring');

function index(app) {
  app.get('/', (req, res) => {
    res.send("Studify running..")
  })
  
  app.get('/drop',(req,res)=> {
    User.drop();
    res.send('dropped')
  })

  app.get('/ranking',(req,res)=> {
    User.find()
    .sort({max_time: -1})
    .exec((req,model)=> {
      res.render('index',{data: model});
    })
  })


  app.get('/users', (req, res) => {
    User.find((err, model) => {
      if (err) throw err;
      res.status(200).send({ model: model }) ;
    })
  })

  app.post('/user/fetch', (req,res)=> {
    let token = req.body.token;
    User.findOne({token: token},(err,model)=> {
      if (err) throw err;
      if (model == null) {
        res.status(404).send("Wrong Token")
      } else {
        res.status(200).send(model)
      }
    })
  })

  app.post('/user/register', function (req, res) {
    let user = new User({
      name: req.body.name,
      facebookId: req.body.facebookId,
      profileURL: req.body.profileURL,
      current: "",
      start_time: -1,
      end_time: -1,
      average_time: 0,
      max_time: 0,
      token: random_string.generate(),
      times: 0
    })
    User.findOne({facebookId: req.body.facebookId} , (err,model)=> {
      if (err) throw err;

      if (model == null) { //새로운 유저일 경우
        user.save((err,model)=>{
          if (err) throw err;
          res.status(200).send({userModel: model})
        })
      } else {
        res.status(200).send({
          userModel: model
        })
      }
    })
  })

  app.post('/user/ranking', function(req,res) {
    User.find().sort({max_time: -1}).exec((err,model)=> {
      if (err) throw err;
      res.status(200).send(model)
    })
  })
  
  app.post('/user/friend/ranking', function(req,res) {
    let ids = String(req.body.ids).split(',')

    User.find({facebookId: {$in: ids}}).sort({max_time: -1}).exec((err,model)=> {
      if (err) throw err;
      res.status(200).send(model)
    })
  })

  app.post('/user/friend/current', function(req,res) {
    let ids = String(req.body.ids).split(',')

    User.find({facebookId: {$in: ids}}).sort({max_time: -1}).exec((err,model)=> {
      if (err) throw err;
      res.status(200).send(model.map((e)=>{return e.current}))
    })
  })

  app.post('/user/start', function(req,res) {
    let token = req.body.token;
    let current = req.body.current;
    User.findOne({token: token},(err,model)=> { 
      if (err) throw err;


      if (model == null) {
        res.status(404).send("Wrong Token")
      } else {
        //시간 흘러가기 시작
        //종료 시간은 0으로
        //이미 시작했던 경우에
        let time = new Date().getTime()
        let along = (model.end_time != -1) ? (time - model.end_time) / 1000 : 0;
        User.updateOne({token:token},{$set: {start_time: time, end_time: -1,current: current}},(err,model)=> {
          if (err) throw err;
          res.status(200).send({amount: along ,message: "초만에 시작하는 공부"});
        })

        var date = new Date(); 
        var year = date.getFullYear(); 
        var month = new String(date.getMonth()+1); 
        var day = new String(date.getDate()); 
        
        // 한자리수일 경우 0을 채워준다. 
        if(month.length == 1){ 
          month = "0" + month; 
        } 
        if(day.length == 1){ 
          day = "0" + day; 
        } 
        let flatTime = year + "" + month + "" + day;

        Study.findOne({date: flatTime},(err,model)=> {
          if (err) throw err;
          if (model == null) {
            //오늘의 공부가 존재하지 않을 경우
            let study = new Study({
              date: String,
              amount: 0,
              userToken: token,
              token: random_string.generate()
            })
            study.save((err,model)=> {
              if (err) throw err;
            })
          }
        })
      }
    })
  })

  app.post('/user/end', function(req,res) {
    let token = req.body.token;
    console.log(token)
    User.findOne({token: token},(err,model)=> {
      if (err) throw err;
      if (model == null) {
        res.status(404).send("Wrong Token")
      } else {
        console.log(model)
        if (model.start_time != -1) { //시작이 돼있었을경우에
          let started = model.start_time;
          let ended = new Date().getTime()
          let amount = (ended - started) / 1000 //result : second
          let max_time = model.max_time

          //Max time update
          if (max_time < amount) {
            max_time = amount;
          }

          //Calculating average
          var times = model.times == null ? 0 : model.times;
          let average_time = (model.average_time * times + amount)/(times+1);
          times = times+1;

          User.updateOne({token:token},{$set: {average_time: average_time,start_time: -1, end_time: ended, max_time: max_time, current: "", times: times}},(err,model)=> {
            if (err) throw err;
            //res.status(200).send({amount: amount})
          })

          //MARK: - Study Records
          // 한자리수일 경우 0을 채워준다. 
          if(month.length == 1){ 
            month = "0" + month; 
          } 
          if(day.length == 1){ 
            day = "0" + day; 
          } 
          let flatTime = year + "" + month + "" + day;

          Study.findOne({date: flatTime},(err,model)=> {
            if (err) throw err;
            if (model == null) {
              //오늘의 공부가 존재하지 않을 경우
              let study = new Study({
                date: String,
                amount: amount,
                userToken: token,
                token: random_string.generate()
              })
              study.save((err,model)=> {
                if (err) throw err;
              })
            } else { //이미 존재할 경우
              User.updateOne({token: model.token},{$inc: {amount: amount}},(err,model)=> {
                if (err) throw err;
                res.status(200).send({amount: amount})
              })
            }
          })
          
        } else {
          res.status(404).send('Already ended')
        }
        
      }
    })
  })

  app.post('/user/updateAverageTime', function(req,res) {
    let token = req.body.token;
    let newValue = req.body.average_time;

    User.find({token: token},(err,model)=> {
      if (err) throw err;
      if (model.length == 0) {
        res.status(404).send("Wrong Token")
      } else {
        User.updateOne({token: token},{$set: {average_time: newValue}},(err,model)=> {
          if (err) throw err;
          res.status(200).send({
            message: "success",
            result: model
          })
        })
      }
    })
  })

  app.post('/user/updateMaxTime', function(req,res) {
    let token = req.body.token;
    let newValue = req.body.max_time;

    User.find({token: token},(err,model)=> {
      if (err) throw err;
      if (model.length == 0) {
        res.status(404).send("Wrong Token")
      } else {
        User.update({token: token},{$set: {max_time: newValue}},(err,model)=> {
          if (err) throw err;
          res.status(200).send({
            message: "success",
            result: model
          })
        })
      }
    })
  })
}




