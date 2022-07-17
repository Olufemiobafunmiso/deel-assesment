const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {sequelize} = require('./model')
const routes = require('./routes')
const { getStatusCode, getErrorMessage} = require('./utils/error');



app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', async(req, res)=>{
  return res.status(200).json({ message: 'welcome 🚀🚀🚀' })
})
app.use('/api/v1', routes);

app.all('*', (req, res) => {
    return res.status(404).json({ message: '#NOT_FOUND 😒😒😒' })
  })



  app.use((err, req, res, next) => {
    const statusCode = getStatusCode(err);
    const message = getErrorMessage(err);
    return res.status(statusCode).json({ message });
  });


module.exports = app;
