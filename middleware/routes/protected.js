// Require modules
const express = require('express');
const helper = require('./../../controllers/helper');
const openingHour = require('./../../controllers/openingHour');
const channel = require('./../../controllers/channel');
const entity = require('./../../controllers/entity');
require('datejs');
//var Q = require('q');
// Setup router for protected routes
var protectedRouter = express.Router();

// HTML endpoints
protectedRouter.get('/', async function (req, res) {
  //if param does not exist//

    if (typeof req.query.week == 'undefined') {
        //$startofweek = this monday
        //redirect to this route with ?week=$startofweek
        res.writeHead(302, {
            'Location': '?week=' + helper.getMonday(new Date()).toISOString()
            //add other headers here...
        });
        res.end();


    }

    try {
        var channels =  await channel.loadChannels();
        var entities = await entity.loadEntities();
    } catch (err) {
        console.error(err)
    }
    var weekdays = {};
    var $startofweekString = req.query.week;
    var $startofweek = new Date($startofweekString);
    var formattedVandaag = new Date().toString('yyyy-MM-dd');
    var $startNextWeek = $startofweek.clone().add(7).days();
    var $startPrevWeek =  $startofweek.clone().add(-7).days();
    ////// Calculate these two"//////
    var curWeekText = '';


    var d = new Date;

    if(d.getDay() == 1) {
        var monday = Date.parse('today');
    }else{
        var monday = Date.today().last().monday()
    }
    if (monday.toString("M/d/yyyy")  == $startofweek.toString("M/d/yyyy")){
        curWeekText = 'Deze week';
    } else {
        curWeekText = 'De week van ' + $startofweek.toString("d MMMM");
    }


    var curEntityId = req.query.entity || 1;
    var curChannelId = req.query.channel || 1;
    var monday = $startofweek;
    var tuesday = $startofweek.clone().add(1).days();
    var wednesday = $startofweek.clone().add(2).days();
    var thursday = $startofweek.clone().add(3).days();
    var friday = $startofweek.clone().add(4).days();
    var saturday = $startofweek.clone().add(5).days();
    var sunday = $startofweek.clone().add(6).days();
    try {
        var mondaySlots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,monday.toString('yyyy-MM-dd'));
        var tuesdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,tuesday.toString('yyyy-MM-dd'));
        var wednesdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,wednesday.toString('yyyy-MM-dd'));
        var thursdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,thursday.toString('yyyy-MM-dd'));
        var fridayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,friday.toString('yyyy-MM-dd'));
        var saturdayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,saturday.toString('yyyy-MM-dd'));
        var sundayslots =  await openingHour.getOpeningHoursOfDay(curEntityId,curChannelId,sunday.toString('yyyy-MM-dd'));
    } catch (err) {
        console.error(err)
    }
    console.log(tuesdayslots);

        //initialization

        weekdays = {
            monday:{
                date: $startofweek,
                formattedDate: monday.toString('dd MMMM'),
                title: "monday",
                slots: mondaySlots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == monday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag',

            },
            tuesday:{
                formattedDate: tuesday.toString('dd MMMM'),
                date: tuesday,
                title: "tuesday",
                slots: tuesdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == tuesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            wednesday:{
                formattedDate: wednesday.toString('dd MMMM'),
                date: wednesday,
                title: "wednesday",
                slots: wednesdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == wednesday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            thursday:{
                formattedDate: thursday.toString('dd MMMM'),
                date: thursday,
                title: "thursday",
                slots: thursdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == thursday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            friday:{
                formattedDate: friday.toString('dd MMMM'),
                date: friday,
                title: "friday",
                slots: fridayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == friday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            saturday:{
                formattedDate: saturday.toString('dd MMMM'),
                date: saturday,
                title: "saturday",
                slots: saturdayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == saturday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'
            },
            sunday:{
                formattedDate: sunday.toString('dd MMMM'),
                date: sunday,
                title: "sunday",
                slots: sundayslots,
                vandaagClass: (Date.today().toString('yyyy-MM-dd') == sunday.toString('yyyy-MM-dd'))?'vandaag': 'niet_vandaag'

            }
        };

        var weekNav = {
            prevLink: '?week=' + $startPrevWeek.toISOString() + '&entity=' + curEntityId + '&channel=' + curChannelId ,
            nextLink: '?week=' + $startNextWeek.toISOString() + '&entity=' + curEntityId + '&channel=' + curChannelId,
            curWeekTextString: curWeekText,
            weekdays: weekdays,
            formattedVandaag: formattedVandaag,
            entities:entities,
            channels: channels,
            url:  req.originalUrl,
            week: req.query.week,
            curChannel: curChannelId,
            curEntity: curEntityId
        };

        res.render('entry', weekNav);


});

protectedRouter.get('/insertTestData', function (req, res) {

    var $startofweek = new Date();
    var days = {};
    days.monday = $startofweek;
    days.tuesday = $startofweek.clone().add(1).days();
    days.wednesday = $startofweek.clone().add(2).days();
    days.thursday = $startofweek.clone().add(3).days();
    days.friday = $startofweek.clone().add(4).days();
    days.saturday = $startofweek.clone().add(5).days();
    days.sunday = $startofweek.clone().add(6).days();

    //for every day this week
    Object.keys(days).forEach(function(key){
        //select items for today
        var date = days[key];

        openingHour.getOpeningHoursOfDay(1,1,date, function(error, items){
            items.forEach(function(slot){
                console.log(slot);
                openingHour.deleteOpeningHour(slot.id, function(){
                    res.send('IT IS DELETED');
                });
            });

        });
        //create random new slots
        function random(start,limit) {
            return Math.floor(Math.random() * 6) + 1;
        }
        var amount = random(1,5);
        for(i = 0; i< amount; i++) {

            var startuur = random(0,12);//starting_hour
            var startmin = random(0,59);//starting_minute
            var d1 = date
                .set({ hour: startuur, minute: startmin });
            var duration = random(1,3) * 60;// (seconds)
            var d2 = d1.add({seconds: duration})
            var user_id = 1;
            openingHour.createOpeningsUur(1,1,date.toString('yyyy-MM-dd'), Math.floor(d1.getTime()/1000), Math.floor(d2.getTime()/1000),user_id, function(){
                res.send('IT IS CREATED');
            });

        }
    });


    console.log('DONE INSERTING');
});


protectedRouter.get('/channels',  async function (req, res) {
    try {
        var channels =  await channel.loadChannels();
        res.render('channels',{
          channels: channels
        });
    } catch (err) {
        console.error(err)
    }
});


protectedRouter.get('/entities', async function (req, res) {
    try {
        var entities =  await entity.loadEntities();
        res.render('entities',{
            entities: entities
        });
    } catch (err) {
        console.error(err)
    }
});

protectedRouter.get('/login', function (req, res) {
  res.render('login');
});

// Export the router
module.exports = protectedRouter;