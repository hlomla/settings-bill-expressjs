let express = require('express')
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

// const SettingsBill = require('./settingsBill');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
    });
    
const settingsBill = require('./settingsBill');

let app =  express()
const SettingsBILL = settingsBill()
let PORT = process.env.PORT || 3011;

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('index', {settings: SettingsBILL.getSettings(), 
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
    
});

app.get('/actions', function(req, res){
    
});

app.get('/actions/:type', function(req, res){
    
});

app.listen(PORT, function(){
    console.log("App started at PORT: ", PORT);
})

