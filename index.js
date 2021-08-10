let express = require('express')
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
moment().format();
// const SettingsBill = require('./settingsBill');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
    });
    
const settingsBill = require('./settingsBill');

let app =  express()
const SettingsBILL = settingsBill()
let PORT = process.env.PORT || 3015;

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res){
    let levelsReached = "";

    if(SettingsBILL.hasReachedWarningLevel()){
        levelsReached = 'warning'
        }
        if(SettingsBILL.hasReachedCriticalLevel()){
            levelsReached = 'danger'
        }

    res.render('index', {settings: SettingsBILL.getSettings(), 
    totals: SettingsBILL.totals(),  
    colourLevel: levelsReached
      
        })
});

app.post('/settings', function(req, res){

    SettingsBILL.setSettings({

        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    console.log(SettingsBILL.getSettings)
    res.redirect('/')
});

app.post('/action', function(req, res){
    SettingsBILL.recordAction(req.body.actionType);
    res.redirect('/')
});

app.get('/actions', function(req, res){
    let assignSet =  SettingsBILL.actions()
    assignSet.forEach(element => {
        element.actionTimestamp = moment(element.timestamp).fromNow()
    })
    res.render('actions', {actions: assignSet})
});

app.get('/actions/:actionType', function(req, res){
    let actionType = req.params.actionType;
    let assignTime = SettingsBILL.actionsFor(actionType)
    assignTime.forEach(element => {
        element.actionTimestamp = moment(element.timestamp).fromNow()
    })
    res.render('actions', {actions: assignTime})
});

app.listen(PORT, function(){
    console.log("App started at PORT: ", PORT);
})

