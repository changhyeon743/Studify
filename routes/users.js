module.exports = index;

let { User } = require('../DB/User');
var random_string = require('randomstring');

function index(app) {
  app.get('/users', (req, res) => {
    User.find({}, (err, model) => {
      if (err) throw err;
      res.status(200).send({ model: model }) ;
    })
  })

  app.post('/user/register', function (req, res) {
    let user = new User({
      name: req.body.name,
      facebookId: req.body.facebookId,
      start_time: "",
      end_time: "",
      average_time: "",
      max_time: "",
      token: random_string.generate()
    })
    User.find({facebookId: req.body.facebookId} , (err,model)=> {
      if (err) throw err;

      if (model.length == 0) { //새로운 유저일 경우
        user.save((err,model)=>{
          if (err) throw err;
          res.status(200).send({userModel: model})
        })
      } else {
        res.status(404).send({message: "Facebook Id is already existed"})
      }
    })
  })
}




