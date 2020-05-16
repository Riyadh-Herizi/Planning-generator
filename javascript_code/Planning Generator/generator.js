// cursor of days
var current = 0;
let resources = {
    "entities": [
        {
            "id": 1, 'poid': 10, 'nb_hours': 6, 'name': 'Multi-M',
            'sub_entities ': [
                {'name': 'Cours', 'id': 100, 'nb_hours': 3, 'poid': 4 },
                {'name': 'TD', 'id': 101, 'nb_hours': 3, 'poid': 2}]
        },
        {
            'id': 3, 'poid': 6, 'nb_hours': 4, 'name': 'ABD',
            'sub_entities ': [
                {'name': 'Cours', 'id': 103, 'nb_hours': 2, 'poid': 4},
                {'name': 'TP', 'id': 104, 'nb_hours': 2, 'poid': 2} ]
        },
        {
            'id': 2, 'poid': 15, 'nb_hours': 2, 'name': 'MOBILE',
            'sub_entities ': [{'name': 'TP', 'id': 102, 'nb_hours': 2, 'poid': 4, 'require': 1}]
        }
    ],
    'employees': [
        {
            'id': 1000,
            'entities': [{'id': 100, 'repetition': 2}, {'id': 102, 'repetition': 1}]
        }, {
            'id': 1001,
            'entities': [{'id': 103, 'repetition': 1}, {'id': 104, 'repetition': 1}]
        }
    ],
    'wishes': [
        {
            'id_emp': 1000,
            'prefered_day1': 1, 'prefered_day2': 3,
            'priority': 1
        }]
    , 'disponibity': [
        {
            'id_employee': 1000,
            'times': [
                {
                    'start': {"hour": 0, "min": 0},
                    'end': {"hour": 0, "min": 0},
                    'day': 1
                },
                {
                    'start': {"hour": 0, "min": 0},
                    'end':  {"hour": 0, "min": 0},
                    'day': 4
                }
            ]
        }




    ]
    ,'place': [
        {
            'id' : 1,
            'name' : 'sallTp',
            'number' : 2
            , 'disponiblity': [  {
                'start' : {"hour": 0, "min": 0},
                'end' : {"hour": 0, "min": 0}
            }, {
                'start' : {"hour": 0, "min": 0},
                'end' : {"hour": 0, "min": 0}
            }, {
                'start' : {"hour": 0, "min": 0},
                'end' : {"hour": 0, "min": 0}
            }, {
                'start' : {"hour": 0, "min": 0},
                'end' : {"hour": 0, "min": 0}
            } ]
        }

    ]
    , 'restricted' : [
        {   'day' : 0,
            'start' : {"hour": 0, "min": 0},
            'end' : {"hour": 0, "min": 0}
        }
    ]
    ,'days': [
        { 'day' : 1 , 'use' : false },
        { 'day' : 2 , 'use' : false },
        { 'day' : 3 , 'use' : false },
        { 'day' : 4 , 'use' : false },
        { 'day' : 5 , 'use' : false },
        { 'day' : 6 , 'use' : false },
        { 'day' : 7 , 'use' : false }
    ] ,
    'constraints' : [

        {
            'start' : {"hour": 8, "min": 0},
            'end' : {"hour": 16, "min": 0}
        }
    ]


};

function  get() {
    // Getting Json as String --------------------------------------------------------
    // var json_string = document.getElementById("json").value;
    // Parse String to Json ----------------------------------------------------------
    // This variable is used as a time cursor in a day --------------------------------
    var current_time = [
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0},
         {"hour": 0, "min": 0}
];

    for (let i = 0 ; i < 7 ; i++) {
        current_time[i].hour = resources.constraints[0].start.hour;
        current_time[i].min = resources.constraints[0].start.min;
    }
    //---------------------------------------------------------------------------------
    console.log("Filtering Resources ...");

    // Filtering Entities names + IDs + times + weight from resources -------------
    var sub_entities = [];
    for (let i = 0; i < resources.entities.length; i++) {
        for (let j = 0 ; j < resources.entities[i]["sub_entities "].length ; j++) {
            sub_entities.push({
                "name": resources.entities[i]["sub_entities "][j].name,
                "id": resources.entities[i]["sub_entities "][j].id,
                "poid": resources.entities[i]["sub_entities "][j].poid,
                "nb_hours": resources.entities[i]["sub_entities "][j].nb_hours,
                "require": resources.entities[i]["sub_entities "][j].require
            });
        }


    }
    console.log(sub_entities);
    console.log("---------------------------------------------------------------------------------");
    //---------------------------------------------------------------------------------
    console.log("Sorting Wishes ...");
    var wishes = [];
    for (let i = 0; i < resources.wishes.length; i++) {
        wishes.push({
            "id": resources.wishes[i].id,
            "prefered_day1": resources.wishes[i].prefered_day1,
            "prefered_day2": resources.wishes[i].prefered_day2,
            "priority": resources.wishes[i].priority
        });
    }

     wishes.sort((first_wish, second_wish) =>
        (first_wish.priority > second_wish.priority) ? 1 :
            ((second_wish.priority > first_wish.priority) ? -1 : 0));

    //---------------------------------------------------------------------------------

    console.log("Sorting Entities ...");
    // Sort entities per weight ( trie par bulles 1CPI )
    sub_entities.sort((first_entity, second_entity) =>
        (first_entity.poid < second_entity.poid) ? 1 :
            ((second_entity.poid < first_entity.poid) ? -1 : 0));
    console.log(sub_entities);
    console.log("---------------------------------------------------------------------------------");
    console.log(wishes);
    console.log("---------------------------------------------------------------------------------");
    //---------------------------------------------------------------------------------
    console.log("Start Creating Planning ...");
    // Start Creating Planning

    console.log("---------------------------------------------------------------------------------");


    var index = 0;
    var planning = [];
    console.log("Stage 01 : initialization using wishes form");
    var reverse = false ;
    for (let i = 0; i < get_days_number() ; i++) {
            console.log("initializing Day 0"+(i+1)+" ...");
            var max_sub_entity = sub_entities[index];
             current = next_day(current);
             if (current>0 ) {
                 index++;
                 planning.push( {'name_entity' :max_sub_entity.name , 'name_employee': '' , 'id_emp' :0 ,
                     'id_sub_entity':max_sub_entity.id , 'start' : {"hour": current_time[current-1].hour , "min": 0},
                     'end':{"hour":  current_time[current-1].hour + max_sub_entity.nb_hours, "min": 0}  , 'day' : current});
             }else {
                 console.log("no day");
                 break;
             }

        }
    console.log(planning);

    console.log("Starting Optimisation ...");
}

function get_days_number() {
    var x =0 ;
    for (let i = 0; i < 7 ; i++) {
       if (resources.days[i].use === true) x++;
    }
    return x;

}
function  next_day(current) {
    for ( let i =current; i< resources.days.length; i++) {
        if (resources.days[i].use === true ) return i+1
    }
    return 0;
}
function  prev_day(current) {
    for ( let i =current; i< resources.days.length; i--) {
        if (resources.days[i].use === true ) return i+1
    }
    return 0;
}

