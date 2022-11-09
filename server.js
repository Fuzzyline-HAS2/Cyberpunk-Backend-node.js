//server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;//포트 5000 할당

let device_list = ['itembox','generator','revivalmachine','escapemachine','temple','duct','tagmachine'];

let cyberpunk_refresh_request = false; 
let iotglove_refresh_request = false; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('hello node!');
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    post: 3306,
    password: 'Code3824@',
    database: 'has2'
});

//Cyberpunk - react에서 새로고침 요청
app.get('/api/cyberpunk_refresh_request', (req,res) => {
    cyberpunk_refresh_request = true;
    res.end();
});
//Cyberpunk - php(esp)에서 새로고침 요청
app.get('/api/cyberpunk_php_request', (req,res) => {
    cyberpunk_refresh_request = true;
    res.end();
});
//Cyberpunk 테마의 장치 정보만 수집. - iotglove 제외 
app.get('/api/DB_cyberpunk', (req,res) => {
    if(cyberpunk_refresh_request === false){
        res.end();
    }
    else{ //cyberpunk_refresh_request === true 일때만 데이터 전송. 
        cyberpunk_refresh_request = false;
        console.log('DB_cyberpunk')
        let sql_device = 'SELECT * FROM device where theme = "cyberpunk"';
        connection.query(sql_device, (err_device, rows_device) => {
            if(err_device)res.send('[/api/DB_cyberpunk device] is not excuted. select fail...\n' + err_duct);
            let sql_device = 'SELECT * FROM cyberpunk_duct';
            connection.query(sql_device, (err_duct, rows_duct) => {
                if(err_duct)res.send('[/api/DB_cyberpunk duct] is not excuted. select fail...\n' + err_duct);
                sql_device = 'SELECT * FROM cyberpunk_escapemachine';
                connection.query(sql_device, (err_escapemachine, rows_escapemachine) => {
                    if(err_escapemachine)res.send('[/api/DB_cyberpunk escapemachine] is not excuted. select fail...\n' + err_escapemachine);
                    sql_device = 'SELECT * FROM cyberpunk_generator';
                    connection.query(sql_device, (err_generator, rows_generator) => {
                        if(err_generator)res.send('[/api/DB_cyberpunk generator] is not excuted. select fail...\n' + err_generator);
                        sql_device = 'SELECT * FROM cyberpunk_revivalmachine';
                        connection.query(sql_device, (err_revivalmachine, rows_revivalmachine) => {
                            if(err_revivalmachine)res.send('[/api/DB_cyberpunk revivalmachine] is not excuted. select fail...\n' + err_revivalmachine);
                            sql_device = 'SELECT * FROM cyberpunk_itembox';
                            connection.query(sql_device, (err_itembox, rows_itembox) => {
                                if(err_itembox)res.send('[/api/DB_cyberpunk itembox] is not excuted. select fail...\n' + err_itembox);
                                sql_device = 'SELECT * FROM cyberpunk_tagmachine';
                                connection.query(sql_device, (err_tagmachine, rows_tagmachine) => {
                                    if(err_tagmachine)res.send('[/api/DB_cyberpunk tagmachine] is not excuted. select fail...\n' + err_tagmachine);
                                    sql_device = 'SELECT * FROM cyberpunk_temple';
                                    connection.query(sql_device, (err_temple, rows_temple) => {
                                        if(err_temple)res.send('[/api/DB_cyberpunk temple] is not excuted. select fail...\n' + err_temple);
                                        res.send({device : rows_device,duct : rows_duct,escapemachine : rows_escapemachine,generator : rows_generator,revivalmachine : rows_revivalmachine,itembox : rows_itembox,tagmachine : rows_tagmachine,temple : rows_temple});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});

//Iotglove - react에서 새로고침 요청
app.get('/api/iotglove_refresh_request', (req,res) => {
    iotglove_refresh_request = true;
    res.end();
});
//Iotglove - php(esp)에서 새로고침 요청
app.get('/api/iotglove_php_request', (req,res) => {
    iotglove_refresh_request = true;
    res.end();
});
//Iotglove 장치 정보만 수집.
app.get('/api/DB_iotglove', (req,res) => {
    if(iotglove_refresh_request === false){
        res.end();
    }
    else{
        iotglove_refresh_request = false;
        console.log('DB_iotglove')
        let sql_device = 'SELECT * FROM device where device_type = "iotglove"';
        connection.query(sql_device, (err_device, rows_device) => {
            if(err_device)res.send('[/api/DB_cyberpunk device] is not excuted. select fail...\n' + err_duct);
            let sql_cyberpunk_iotglove = 'SELECT * FROM cyberpunk_iotglove';
            connection.query(sql_cyberpunk_iotglove, (err_device, rows_cyberpunk) => {
                if(err_device)res.send('[/api/DB_cyberpunk device] is not excuted. select fail...\n' + err_duct);
                res.send({device : rows_device,cyberpunk : rows_cyberpunk});
            })
        })
    }
})
app.post('/api/reset', (req,res) => {
    let sql_reset;
    let create_itembox = "CREATE TABLE `"+req.body.theme+"_itembox` ("
                        + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                        + "`device_type` varchar(45) NOT NULL,"
                        + "`game_state` varchar(45)  NOT NULL,"
                        + "`device_state` varchar(45)  NOT NULL,"
                        + "`battery_pack` int  NOT NULL,"
                        + "`exp_pack` int  NOT NULL,"
                        + "`mode` varchar(45)  NOT NULL);";
    let create_generator =  "CREATE TABLE `"+req.body.theme+"_generator` ("
                            + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                            + "`device_type` varchar(45) NOT NULL,"
                            + "`game_state` varchar(45)  NOT NULL,"
                            + "`device_state` varchar(45)  NOT NULL,"
                            + "`battery_pack` int  NOT NULL,"
                            + "`max_battery_pack` int  NOT NULL,"
                            + "`mode` varchar(45)  NOT NULL);";
    let create_revivalmachine = "CREATE TABLE `"+req.body.theme+"_revivalmachine` ("
                                + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                                + "`device_type` varchar(45) NOT NULL,"
                                + "`game_state` varchar(45)  NOT NULL,"
                                + "`device_state` varchar(45)  NOT NULL,"
                                + "`life_chip` int  NOT NULL,"
                                + "`activate_num` int  NOT NULL,"
                                + "`mode` varchar(45)  NOT NULL);";
    let create_escapemachine = "CREATE TABLE `"+req.body.theme+"_escapemachine` ("
                                + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                                + "`device_type` varchar(45) NOT NULL,"
                                + "`game_state` varchar(45)  NOT NULL,"
                                + "`device_state` varchar(45)  NOT NULL,"
                                + "`max_ghost_tag` int NOT NULL,"
                                + "`mode` varchar(45)  NOT NULL);";
    let create_temple = "CREATE TABLE `"+req.body.theme+"_temple` ("
                        + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                        + "`device_type` varchar(45) NOT NULL,"
                        + "`game_state` varchar(45)  NOT NULL,"
                        + "`device_state` varchar(45)  NOT NULL,"
                        + "`taken_chip` int NOT NULL,"
                        + "`mode` varchar(45)  NOT NULL);"
    let create_duct = "CREATE TABLE `"+req.body.theme+"_duct` ("
                    + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                    + "`device_type` varchar(45) NOT NULL,"
                    + "`game_state` varchar(45)  NOT NULL,"
                    + "`device_state` varchar(45)  NOT NULL,"
                    + "`cool_time` int  NOT NULL,"
                    + "`mode` varchar(45)  NOT NULL);";
    let create_tagmachine = "CREATE TABLE `"+req.body.theme+"_tagmachine` ("
                            + "`device_name` varchar(45) NOT NULL PRIMARY KEY,"
                            + "`device_type` varchar(45) NOT NULL,"
                            + "`game_state` varchar(45)  NOT NULL,"
                            + "`device_state` varchar(45)  NOT NULL,"
                            + "`player_lock_time` int  NOT NULL,"
                            + "`player_unlock_time` int  NOT NULL,"
                            + "`tagger_unlock_time` int  NOT NULL,"
                            + "`ghost_open_time` int  NOT NULL,"
                            + "`mode` varchar(45)  NOT NULL);";

    if(req.body.device === 'all_except_iot'){
        cyberpunk_refresh_request = true;
        sql_reset = "DROP TABLE "+req.body.theme+"_itembox,"+req.body.theme+"_generator,"+req.body.theme+"_revivalmachine,"+req.body.theme+"_escapemachine,"+req.body.theme+"_temple,"+req.body.theme+"_duct,"+req.body.theme+"_tagmachine";
        connection.query(sql_reset, (err, rows) => {
            if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
        });
        //각 테이블 생성 
        connection.query(create_itembox, (err, rows) => {
            if(err)res.send(create_itembox + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_generator, (err, rows) => {
            if(err)res.send(create_generator + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_revivalmachine, (err, rows) => {
            if(err)res.send(create_revivalmachine + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_escapemachine, (err, rows) => {
            if(err)res.send(create_escapemachine + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_temple, (err, rows) => {
            if(err)res.send(create_temple + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_duct, (err, rows) => {
            if(err)res.send(create_duct + ' query is not excuted. select fail...\n' + err);
        });
        connection.query(create_tagmachine, (err, rows) => {
            if(err)res.send(create_tagmachine + ' query is not excuted. select fail...\n' + err);
        });
        //shift_machine = 2로 변경해야함. 
        sql_reset = "UPDATE device set shift_machine = 1 where theme = '"+req.body.theme+"' and device_type not in('iotglove')";
        connection.query(sql_reset, (err, rows) => {
            if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
        });
        //각 테이블 데이터 추가 
        for(let i = 0; i < device_list.length ; i++){
            // sql_reset ="insert into cyberpunk_" +device_list[i]+ " select b.device_name,a.* from "+device_list[i]+" as a, device as b where a.device_type=b.device_type and b.theme = 'cyberpunk'"
            sql_reset = "insert into "+req.body.theme+"_"+device_list[i]+" select b.device_name,a.* from "+device_list[i]+" as a, device as b where a.device_type=b.device_type and b.theme = '"+req.body.theme+"'";
            connection.query(sql_reset, (err, rows) => {
                if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
            });
        }
    }
    else {
        cyberpunk_refresh_request = true;
        //테이블 삭제 쿼리 
        sql_reset = "DROP TABLE "+req.body.theme+"_"+req.body.device;
        connection.query(sql_reset, (err, rows) => {
            if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
        });
        //테이블 생성 쿼리 
        switch (req.body.device){
            case 'itembox':
                connection.query(create_itembox, (err, rows) => {
                    if(err)res.send(create_itembox + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'revivalmachine':
                connection.query(create_revivalmachine, (err, rows) => {
                    if(err)res.send(create_revivalmachine + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'tagmachine':
                connection.query(create_tagmachine, (err, rows) => {
                    if(err)res.send(create_tagmachine + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'duct':
                connection.query(create_duct, (err, rows) => {
                    if(err)res.send(create_duct + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'generator':
                connection.query(create_generator, (err, rows) => {
                    if(err)res.send(create_generator + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'escapemachine':
                connection.query(create_escapemachine, (err, rows) => {
                    if(err)res.send(create_escapemachine + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'temple':
                connection.query(create_temple, (err, rows) => {
                    if(err)res.send(create_temple + ' query is not excuted. select fail...\n' + err);
                });
                break;
        }
        sql_reset = "UPDATE device set shift_machine = 2 where theme = '"+req.body.theme+"' and device_type = '"+req.body.device+"'";
        connection.query(sql_reset, (err, rows) => {
            if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
        });
        //테이블 작성 쿼리 
        sql_reset = "insert into "+req.body.theme+"_"+req.body.device+" select b.device_name,a.* from "+req.body.device+" as a, device as b where a.device_type=b.device_type and b.theme = '"+req.body.theme+"'";
        connection.query(sql_reset, (err, rows) => {
            if(err)res.send(sql_reset + ' query is not excuted. select fail...\n' + err);
        });
    }
    res.end();
})
app.post('/api/update', (req,res) => {
    let sql_update;
    cyberpunk_refresh_request = true;

    if(req.body.device === 'all_except_iot'){
        if(req.body.state === 'S'){
            for(let i = 0; i < device_list.length ; i++){
                sql_update = "UPDATE "+req.body.theme+"_"+device_list[i]+" set game_state = 'stop'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
        }
        else if(req.body.state === 'R'){
            for(let i = 0; i < device_list.length ; i++){
                sql_update = "UPDATE "+req.body.theme+"_"+device_list[i]+" set game_state = 'ready'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
        }
        else if(req.body.state === 'A'){
            for(let i = 0; i < device_list.length ; i++){
                sql_update = "UPDATE "+req.body.theme+"_"+device_list[i]+" set game_state = 'activate'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
        }
        sql_update = "UPDATE device set shift_machine = 2 where theme = '"+req.body.theme+"' and device_type not in('"+req.body.device+"')";
        connection.query(sql_update, (err, rows) => {
            if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
        });
    }
    else {
            if(req.body.state === 'S'){
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'stop'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
            else if(req.body.state === 'R'){
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'ready'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
            else if(req.body.state === 'A'){
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'activate'"; 
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
            }
            sql_update = "UPDATE device set shift_machine = 2 where theme = '"+req.body.theme+"' and device_type = '"+req.body.device+"'";
            connection.query(sql_update, (err, rows) => {
                if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
            });
    }
    res.end();
});
app.post('/api/update/dropdown', (req,res) => {
    let sql_update;
    cyberpunk_refresh_request = true;
    
    if(req.body.command.includes('game_state')){
        switch(req.body.command.slice(11)){
            case 'S':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'stop' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'R':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'ready' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'A':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'activate' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
        }
    }
    else if(req.body.command.includes('device_state')){ //아직 작성 안함. 
        console.log(req.body.command.slice(13))
        switch(req.body.command.slice(13)){
            case 'S':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'stop' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'R':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'ready' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
            case 'A':
                sql_update = "UPDATE "+req.body.theme+"_"+req.body.device+" set game_state = 'activate' where device_name = '"+req.body.device_name+"'";
                connection.query(sql_update, (err, rows) => {
                    if(err)res.send(sql_update + ' query is not excuted. select fail...\n' + err);
                });
                break;
        }
    }
    res.end();
});
app.post('/api/timer', (req,res) => {
    let sql_timer
    switch(req.body.command){
        case 'reset':
            console.log('rest')
            sql_timer = "UPDATE timer set sec = 2100 where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
            });
            sql_timer = "SELECT sec FROM timer where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
                console.log(rows)
                res.send(rows)
            });
            break;
        case 'start':
            console.log('start')
            sql_timer = "UPDATE timer set sec = sec - 1 where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
            });
            sql_timer = "SELECT sec FROM timer where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
                console.log(rows)
                res.send(rows)
            });
            break;
        case 'stop':
            console.log('stop')
            res.end();
            break;
        case 'reload':
            sql_timer = "SELECT sec FROM timer where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
                console.log(rows)
                res.send(rows)
            });
            break;
        default :
            sql_timer = "UPDATE timer set sec = sec + "+req.body.command+" where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            console.log(sql_timer)
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
            });
            sql_timer = "SELECT sec FROM timer where timer_name = '"+req.body.theme+"_"+req.body.timer_name+"'"; 
            connection.query(sql_timer, (err, rows) => {
                if(err)res.send(sql_timer+ ' query is not excuted. select fail...\n' + err);
                console.log(rows)
                res.send(rows)
            });
            break;
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`));

//코딩 끝나면 해야할 일 -> 주석 검색해서 위치 찾기 
//shift_machine = 2로 변경해야함.  