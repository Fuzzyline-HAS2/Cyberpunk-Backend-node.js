//server.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express(); //서버에 필요한 기능인 미들웨어를 어플리케이션에 추가
const port = process.env.PORT || 5000; //포트 5000 할당

//장치 이름 list -> 모든 장치의 데이터를 변경할 때 사용되는 list
let device_list = [
	"itembox",
	"generator",
	"revivalmachine",
	"escapemachine",
	"temple",
	"duct",
	"tagmachine",
];

let cyberpunk_refresh_request = false; //true일 때 cyberpunk 테마의 DB에서 웹으로 데이터 가져오기
let iotglove_refresh_request = false; //true일 때 iotglove의 DB에서 웹으로 데이터 가져오기

//미들웨어를 추가할 때는 use함수를 사용한다
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test용
app.get("/", (req, res) => {
	res.send("hello node!");
});

//DB와 서버 연결을 위한 객체 생성
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	post: 3306,
	password: "Code3824@",
	database: "has2",
});

//Cyberpunk - react에서 새로고침 요청
app.get("/api/cyberpunk_refresh_request", (req, res) => {
	cyberpunk_refresh_request = true;
	res.end();
});
//Cyberpunk - php(esp)에서 새로고침 요청
app.get("/api/cyberpunk_php_request", (req, res) => {
	cyberpunk_refresh_request = true;
	console.log("php");
	res.end();
});
//Cyberpunk 테마의 장치 정보만 수집. - iotglove 제외
app.get("/api/DB_cyberpunk", (req, res) => {
	if (cyberpunk_refresh_request === false) {
		res.end();
	} else {
		//cyberpunk_refresh_request === true 일때만 데이터 전송.(react에서 새로고침 요청 or php 요청)
		cyberpunk_refresh_request = false;
		console.log("DB_cyberpunk");
		let sql_device = 'SELECT * FROM device where theme = "cyberpunk"'; //device table에서 테마가 cyberpunk인 장치들의 정보 요청 쿼리
		connection.query(sql_device, (err_device, rows_device) => {
			if (err_device)
				res.send(
					"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
						err_duct
				);
			let sql_device = "SELECT * FROM cyberpunk_duct"; //cyberpunk_duct의 정보 요청 쿼리
			connection.query(sql_device, (err_duct, rows_duct) => {
				if (err_duct)
					res.send(
						"[/api/DB_cyberpunk duct] is not excuted. select fail...\n" +
							err_duct
					);
				sql_device = "SELECT * FROM cyberpunk_escapemachine"; //cyberpunk_escapemachine의 정보 요청 쿼리
				connection.query(
					sql_device,
					(err_escapemachine, rows_escapemachine) => {
						if (err_escapemachine)
							res.send(
								"[/api/DB_cyberpunk escapemachine] is not excuted. select fail...\n" +
									err_escapemachine
							);
						sql_device = "SELECT * FROM cyberpunk_generator"; //cyberpunk_generator의 정보 요청 쿼리
						connection.query(sql_device, (err_generator, rows_generator) => {
							if (err_generator)
								res.send(
									"[/api/DB_cyberpunk generator] is not excuted. select fail...\n" +
										err_generator
								);
							sql_device = "SELECT * FROM cyberpunk_revivalmachine"; //cyberpunk_revivalmachine의 정보 요청 쿼리
							connection.query(
								sql_device,
								(err_revivalmachine, rows_revivalmachine) => {
									if (err_revivalmachine)
										res.send(
											"[/api/DB_cyberpunk revivalmachine] is not excuted. select fail...\n" +
												err_revivalmachine
										);
									sql_device = "SELECT * FROM cyberpunk_itembox"; //cyberpunk_itembox의 정보 요청 쿼리
									connection.query(sql_device, (err_itembox, rows_itembox) => {
										if (err_itembox)
											res.send(
												"[/api/DB_cyberpunk itembox] is not excuted. select fail...\n" +
													err_itembox
											);
										sql_device = "SELECT * FROM cyberpunk_tagmachine"; //cyberpunk_tagmachine의 정보 요청 쿼리
										connection.query(
											sql_device,
											(err_tagmachine, rows_tagmachine) => {
												if (err_tagmachine)
													res.send(
														"[/api/DB_cyberpunk tagmachine] is not excuted. select fail...\n" +
															err_tagmachine
													);
												sql_device = "SELECT * FROM cyberpunk_temple"; //cyberpunk_temple의 정보 요청 쿼리
												connection.query(
													sql_device,
													(err_temple, rows_temple) => {
														if (err_temple)
															res.send(
																"[/api/DB_cyberpunk temple] is not excuted. select fail...\n" +
																	err_temple
															);
														res.send({
															//cyberpunk 테마의 모든 장치 정보를 react로 전송
															device: rows_device,
															duct: rows_duct,
															escapemachine: rows_escapemachine,
															generator: rows_generator,
															revivalmachine: rows_revivalmachine,
															itembox: rows_itembox,
															tagmachine: rows_tagmachine,
															temple: rows_temple,
														});
													}
												);
											}
										);
									});
								}
							);
						});
					}
				);
			});
		});
	}
});
app.post("/api/reset", (req, res) => {
	let sql_reset;
	console.log(req.body);
	if (req.body.device === "all_except_iot") {
		cyberpunk_refresh_request = true;
		for (let i = 0; i < device_list.length; i++) {
			//테이블 내용 삭제 -> 데이터 추가
			sql_reset = "TRUNCATE " + req.body.theme + "_" + device_list[i];
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
			// sql_reset ="insert into cyberpunk_" +device_list[i]+ " select b.device_name,a.* from "+device_list[i]+" as a, device as b where a.device_type=b.device_type and b.theme = 'cyberpunk'"
			sql_reset =
				"insert into " +
				req.body.theme +
				"_" +
				device_list[i] +
				" select b.device_name,a.* from " +
				device_list[i] +
				" as a, device as b where a.device_type=b.device_type and b.theme = '" +
				req.body.theme +
				"'";
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
		}
		sql_reset =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"' and device_type not in('iotglove')";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.device === "mp3") {
		sql_reset = "TRUNCATE " + req.body.theme + "_mp3";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			// console.log(rows)
		});
		sql_reset =
			"UPDATE device set watchdog = '1' where device_name = 'cyberpunkOS'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			// console.log(rows)
		});
	} else {
		cyberpunk_refresh_request = true;
		//테이블 내용 삭제 쿼리
		sql_reset = "TRUNCATE " + req.body.theme + "_" + req.body.device;
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
		//테이블 작성 쿼리
		sql_reset =
			"insert into " +
			req.body.theme +
			"_" +
			req.body.device +
			" select b.device_name,a.* from " +
			req.body.device +
			" as a, device as b where a.device_type=b.device_type and b.theme = '" +
			req.body.theme +
			"'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
		sql_reset =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"' and device_type = '" +
			req.body.device +
			"'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
	}
	res.end();
});
app.post("/api/update", (req, res) => {
	let sql_update;
	cyberpunk_refresh_request = true;
	if (req.body.device === "all_except_iot") {
		if (req.body.state === "S") {
			for (let i = 0; i < device_list.length; i++) {
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					device_list[i] +
					" set game_state = 'setting', device_state = 'setting'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			}
		} else if (req.body.state === "R") {
			for (let i = 0; i < device_list.length; i++) {
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					device_list[i] +
					" set game_state = 'ready', device_state = 'ready'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			}
		} else if (req.body.state === "A") {
			for (let i = 0; i < device_list.length; i++) {
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					device_list[i] +
					" set game_state = 'activate', device_state = 'activate'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			}
		}
		sql_update =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"' and device_type not in('iotglove')";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.device === "game_start") {
		console.log("req.body.device === 'game_start' 대체 어디서 쓰는거야;;;;");
		for (let i = 0; i < device_list.length; i++) {
			if (device_list !== "revivalmachine" || device_list !== "escapemachine") {
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					device_list[i] +
					" set game_state = 'activate'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			}
		}
		sql_update =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"' and device_type not in('escapemachine,revivalmachine')";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else {
		if (req.body.state === "S") {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device +
				" set game_state = 'setting', device_state = 'setting'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		} else if (req.body.state === "R") {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device +
				" set game_state = 'ready', device_state = 'ready'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		} else if (req.body.state === "A") {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device +
				" set game_state = 'activate', device_state = 'activate'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}
		sql_update =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"' and device_type = '" +
			req.body.device +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	}
	if (req.body.device === "revivalmachine") {
		//생명장치 업데이트
		if (req.body.command === "activate_num") {
			//생명장치 부분 활성화
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device +
				" set " +
				req.body.command +
				" = " +
				req.body.num +
				" WHERE device_name = '" +
				req.body.name +
				"'";
			console.log(sql_update);
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
			sql_update =
				"UPDATE device set shift_machine = 2 where theme = '" +
				req.body.theme +
				"' and device_type = '" +
				req.body.device +
				"'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}
	} else if (req.body.device === "generator") {
		//수리 필요한 발전기 개수 나타내는 부분
		if (req.body.command === "left_generator") {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device +
				" set " +
				req.body.command +
				" = " +
				req.body.command +
				" + " +
				req.body.value;
			console.log(sql_update);
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
			sql_update =
				"UPDATE device set shift_machine = 2 where theme = '" +
				req.body.theme +
				"' and device_type = '" +
				req.body.device +
				"'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}
	}
	res.end();
});
app.post("/api/check", (req, res) => {
	let sql_check;
	cyberpunk_refresh_request = true;
	console.log(req.body);
	if (req.body.device === "all_except_iot") {
		if (req.body.state === "check") {
			sql_check =
				"UPDATE device set shift_machine = 2 where theme = '" +
				req.body.theme +
				"' and device_type not in('iotglove','mp3')";
			connection.query(sql_check, (err, rows) => {
				if (err)
					res.send(sql_check + " query is not excuted. select fail...\n" + err);
			});
		}
	} else if (req.body.device === "iotglove") {
		sql_check =
			"UPDATE device set shift_machine = 2 where device_name Like '" +
			req.body.group +
			"%'";
		connection.query(sql_check, (err, rows) => {
			if (err)
				res.send(sql_check + " query is not excuted. select fail...\n" + err);
		});
	}
	res.end();
});
app.post("/api/update/dropdown", (req, res) => {
	let sql_update;
	cyberpunk_refresh_request = true;
	console.log(req.body);
	if (req.body.command.includes("game_state")) {
		switch (req.body.command.slice(11)) {
			case "S":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'setting', device_state = 'setting'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'setting', device_state = 'setting' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "R":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'ready', device_state = 'ready'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'ready', device_state = 'ready' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "A":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'activate', device_state = 'activate'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set game_state = 'activate', device_state = 'activate' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
		}
	} else if (req.body.command.includes("device_state")) {
		switch (req.body.command.slice(13)) {
			case "check":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE device set shift_machine = 2 where device_type = '" +
						req.body.device_type +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE device set shift_machine = 2 where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "open":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'open'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'open' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "used":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'used'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'used' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "self_revive":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'self_revive'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'self_revive' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "lock":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'lock'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'lock' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "battery_max":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'battery_max'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'battery_max' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "starter_finish":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'starter_finish'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'starter_finish' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "repaired":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'repaired'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'repaired' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "repaired_all":
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					req.body.device_type +
					" set device_state = 'repaired_all'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				//탈출장치 활성화될때 아이템박스에도 발전기가 수리되었음을 device_state로 전송 (dropdown)
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_itembox set device_state = 'repaired_all'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
			case "escape":
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'escape'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set device_state = 'escape' where device_name = '" +
						req.body.device_name +
						"'";
					console.log(sql_update);
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "takenchip+1":
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					req.body.device_type +
					" set taken_chip = taken_chip+1";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
			case "takenchip-1":
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					req.body.device_type +
					" set taken_chip = taken_chip-1";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
			case "takenchip_max":
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					req.body.device_type +
					" set taken_chip = 10, device_state = 'takenchip_max'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
			case "blink":
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_" +
					req.body.device_type +
					" set game_state = 'activate', device_state = 'blink'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
		}
	} else if (req.body.command.includes("manage_state")) {
		switch (req.body.command.slice(13)) {
			case "ml": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'ml'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'ml' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mo": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mo'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mo' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mu": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mu'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mu' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mbm": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mbm'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mbm' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "msf": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'msf'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'msf' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mr": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mr'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mr' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mra": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mra'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mra' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "me": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'me'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'me' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
			case "mtm": //manage_lock
				if (req.body.device_name === "ALL") {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mtm'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				} else {
					sql_update =
						"UPDATE " +
						req.body.theme +
						"_" +
						req.body.device_type +
						" set manage_state = 'mtm' where device_name = '" +
						req.body.device_name +
						"'";
					connection.query(sql_update, (err, rows) => {
						if (err)
							res.send(
								sql_update + " query is not excuted. select fail...\n" + err
							);
					});
				}
				break;
		}
	}
	//업데이트가 되어있어 shift_machine 변경해주는 부분
	if (req.body.device_name === "ALL") {
		sql_update =
			"UPDATE device set shift_machine = 2 where device_type = '" +
			req.body.device_type +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else {
		sql_update =
			"UPDATE device set shift_machine = 2 where device_name = '" +
			req.body.device_name +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	}
	res.end();
});
app.post("/api/timer", (req, res) => {
	let sql_timer;
	switch (req.body.command) {
		case "reset":
			// console.log('rest')
			sql_timer =
				"UPDATE timer set sec = 2101 where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
			});
			sql_timer =
				"SELECT sec FROM timer where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
				// console.log(rows)
				res.send(rows);
			});
			break;
		case "game_start":
			cyberpunk_refresh_request = true;
			sql_timer = "TRUNCATE " + req.body.theme + "_mp3";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
			});
			sql_timer =
				"UPDATE timer set sec = 2101 where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
			});
			sql_timer =
				"SELECT sec FROM timer where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
				// console.log(rows)
			});
		// for(let i = 0; i < device_list.length ; i++){
		//     sql_timer = "UPDATE "+req.body.theme+"_"+device_list[i]+" set game_state = 'activate'";
		//     console.log(sql_timer)
		//     connection.query(sql_timer, (err, rows) => {
		//         if(err)res.send(sql_timer + ' query is not excuted. select fail...\n' + err);
		//     });
		// }
		case "start":
			// console.log('start')
			//mp3 초기화
			sql_timer =
				"UPDATE timer set sec = sec - 1 where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
			});
			sql_timer =
				"SELECT sec FROM timer where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
				// console.log(rows)
				res.send(rows);
			});
			break;
		case "stop":
			console.log("stop");
			res.end();
			break;
		case "reload":
			sql_timer =
				"SELECT sec FROM timer where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
				// console.log(rows)
				res.send(rows);
			});
			break;
		default:
			sql_timer =
				"UPDATE timer set sec = sec + " +
				req.body.command +
				" where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			// console.log(sql_timer)
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
			});
			sql_timer =
				"SELECT sec FROM timer where timer_name = '" +
				req.body.theme +
				"_" +
				req.body.timer_name +
				"'";
			connection.query(sql_timer, (err, rows) => {
				if (err)
					res.send(sql_timer + " query is not excuted. select fail...\n" + err);
				// console.log(rows)
				res.send(rows);
			});
			break;
	}
});
//나래이션에 따라 업데이트 되는 디바이스 상태 api
app.post("/api/update/device", (req, res) => {
	let sql_update;
	cyberpunk_refresh_request = true;
	// console.log(req.body)
	if (
		req.body.device_type !== "revivalmachine" &&
		req.body.device_type !== "escapemachine" &&
		req.body.device_type !== "temple"
	) {
		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET device_state= '" +
			req.body.device_state +
			"', game_state= '" +
			req.body.device_state +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_update =
			"UPDATE device SET shift_machine = shift_machine+1 WHERE device_type = '" +
			req.body.device_type +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.device_type === "revivalmachine") {
		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET device_state= '" +
			req.body.device_state +
			"', game_state= '" +
			req.body.device_state +
			"' WHERE device_name = '" +
			req.body.device_name +
			"' AND device_state != 'used'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_update =
			"UPDATE device SET shift_machine = shift_machine+1 WHERE device_name = '" +
			req.body.device_name +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.device_type === "temple") {
		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET game_state= '" +
			req.body.device_state +
			"', device_state= 'blink' ";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_update =
			"UPDATE device SET shift_machine = shift_machine+1 WHERE device_type = '" +
			req.body.device_type +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	}
	//탈출장치 랜덤으로 2개 활성화
	else if (req.body.device_type === "escapemachine") {
		let max = 3;
		let min = 0;
		let escapemachine = ["BE", "OE", "FE"];
		let activate_escapemachine = [];

		while (1) {
			let rand_num1 = Math.floor(Math.random() * (max - min) + min);
			let rand_num2 = Math.floor(Math.random() * (max - min) + min);

			// console.log('rand_num1:',rand_num1)
			// console.log('rand_num2:',rand_num2)
			if (rand_num1 !== rand_num2) {
				activate_escapemachine.push(escapemachine[rand_num1]);
				activate_escapemachine.push(escapemachine[rand_num2]);
				break;
			}
		}

		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET device_state= '" +
			req.body.device_state +
			"', game_state= '" +
			req.body.device_state +
			"' WHERE device_name = '" +
			activate_escapemachine[0] +
			"' OR device_name = '" +
			activate_escapemachine[1] +
			"'";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_update =
			"UPDATE device SET shift_machine = 2 WHERE device_name = '" +
			activate_escapemachine[0] +
			"' OR device_name = '" +
			activate_escapemachine[1] +
			"'";
		console.log("탈출장치 활성화");
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	}
	res.end();
});
app.post("/api/update/selfrevive", (req, res) => {
	let sql_update;
	cyberpunk_refresh_request = true;
	console.log(req.body);
	if (req.body.command === "self_revive_start") {
		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET game_state= 'activate', device_state= 'activate' WHERE device_state not in('used')";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.command === "self_revive_end") {
		sql_update =
			"UPDATE " +
			req.body.theme +
			"_" +
			req.body.device_type +
			" SET game_state= 'ready', device_state= 'ready' WHERE device_state not in('used')";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		req.body.device_name.forEach((el) => {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				req.body.device_type +
				" SET game_state= 'activate', device_state= 'activate' WHERE device_state not in('used') and device_name = '" +
				el +
				"'";
			console.log(sql_update);
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		});
	}
	sql_update =
		"UPDATE device SET shift_machine = shift_machine+2 WHERE device_type = 'revivalmachine'";
	connection.query(sql_update, (err, rows) => {
		if (err)
			res.send(sql_update + " query is not excuted. select fail...\n" + err);
	});
	res.end();
});
app.post("/api/narration", (req, res) => {
	let sql_narration;
	console.log(req.body);
	// sql_narration = "UPDATE "+req.body.theme+"_"+req.body.device+" SET folder_num = "+req.body.folder_num+", file_num = "+req.body.file_num;
	sql_narration =
		"INSERT INTO " +
		req.body.theme +
		"_" +
		req.body.device +
		"(folder_num,file_num) VALUES(" +
		req.body.folder_num +
		"," +
		req.body.file_num +
		")";
	connection.query(sql_narration, (err, rows) => {
		if (err)
			res.send(sql_narration + " query is not excuted. select fail...\n" + err);
	});
	//mp3 재생에 따른 상태 업데이트
	if (req.body.folder_num === 1) {
		switch (req.body.file_num) {
			case 30: // 0030 VO23 탈출장치가 활성화 됩니다.
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_generator set game_state = 'activate', device_state = 'repaired_all'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				//탈출장치 활성화될때 아이템박스에도 발전기가 수리되었음을 device_state로 전송
				sql_update =
					"UPDATE " +
					req.body.theme +
					"_itembox set game_state = 'activate', device_state = 'repaired_all'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				break;
		}
	}

	sql_narration =
		"UPDATE device SET shift_machine = shift_machine+1 WHERE device_name = '" +
		req.body.theme +
		"OS'";
	connection.query(sql_narration, (err, rows) => {
		if (err)
			res.send(sql_narration + " query is not excuted. select fail...\n" + err);
	});
	res.end();
});

//------IotGlove------IotGlove------IotGlove------IotGlove------IotGlove------IotGlove------IotGlove------IotGlove------//
//Iotglove - react에서 새로고침 요청
app.get("/api/iotglove_refresh_request", (req, res) => {
	iotglove_refresh_request = true;
	res.end();
});
//Iotglove - php(esp)에서 새로고침 요청
app.get("/api/iotglove_php_request", (req, res) => {
	iotglove_refresh_request = true;
	res.end();
});
//Iotglove 장치 정보만 수집.
app.get("/api/DB_iotglove", (req, res) => {
	if (iotglove_refresh_request === false) {
		res.end();
	} else {
		iotglove_refresh_request = false;
		console.log("DB_iotglove");
		let sql_device = 'SELECT * FROM device where device_type = "iotglove"';
		connection.query(sql_device, (err_device, rows_device) => {
			if (err_device)
				res.send(
					"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
						err_duct
				);
			let sql_cyberpunk_iotglove = "SELECT * FROM iotglove_g1";
			connection.query(sql_cyberpunk_iotglove, (err_device, rows_g1) => {
				if (err_device)
					res.send(
						"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
							err_duct
					);
				let sql_cyberpunk_iotglove = "SELECT * FROM iotglove_g2";
				connection.query(sql_cyberpunk_iotglove, (err_device, rows_g2) => {
					if (err_device)
						res.send(
							"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
								err_duct
						);
					let sql_cyberpunk_iotglove = "SELECT * FROM iotglove_g3";
					connection.query(sql_cyberpunk_iotglove, (err_device, rows_g3) => {
						if (err_device)
							res.send(
								"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
									err_duct
							);
						let sql_cyberpunk_iotglove = "SELECT * FROM iotglove_g4";
						connection.query(sql_cyberpunk_iotglove, (err_device, rows_g4) => {
							if (err_device)
								res.send(
									"[/api/DB_cyberpunk device] is not excuted. select fail...\n" +
										err_duct
								);
							res.send({
								device: rows_device,
								g1: rows_g1,
								g2: rows_g2,
								g3: rows_g3,
								g4: rows_g4,
							});
						});
					});
				});
			});
		});
	}
});

app.post("/api/update/iotglove", (req, res) => {
	console.log(req.body);
	let sql_update;
	iotglove_refresh_request = true;
	if (req.body.command === "state_change") {
		if (
			req.body.group === "G1" ||
			req.body.group === "G2" ||
			req.body.group === "G3" ||
			req.body.group === "G4"
		) {
			if (
				req.body.state === "setting" ||
				req.body.state === "ready" ||
				req.body.state === "activate"
			) {
				if (req.body.state === "activate") {
					sql_update =
						"UPDATE iotglove_" +
						req.body.group +
						" SET game_state = '" +
						req.body.state +
						"' ,device_state = '" +
						req.body.state +
						"' ,tagger_name = '" +
						req.body.tagger +
						"'";
				} else {
					sql_update =
						"UPDATE iotglove_" +
						req.body.group +
						" SET game_state = '" +
						req.body.state +
						"' ,device_state = '" +
						req.body.state +
						"'";
				}
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				sql_update =
					"UPDATE device SET shift_machine = shift_machine+1 WHERE device_name like '" +
					req.body.group +
					"%'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			} else if (req.body.state === "blink") {
				//blink 일때 = 술래 결정 완료, 술래만 blink 나머지는 activate
				sql_update =
					"UPDATE iotglove_" +
					req.body.group +
					" SET game_state = 'activate' ,device_state = '" +
					req.body.state +
					"' WHERE role = 'tagger'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				sql_update =
					"UPDATE iotglove_" +
					req.body.group +
					" SET game_state = 'activate' ,device_state = 'activate' WHERE role = 'player' OR role = 'neutral'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
				sql_update =
					"UPDATE device SET shift_machine = shift_machine+1 WHERE device_name like '" +
					req.body.group +
					"%'";
				connection.query(sql_update, (err, rows) => {
					if (err)
						res.send(
							sql_update + " query is not excuted. select fail...\n" + err
						);
				});
			}
		}
	} else if (req.body.command === "photo_state") {
		console.log(req.body);
		if (
			req.body.group === "G1" ||
			req.body.group === "G2" ||
			req.body.group === "G3" ||
			req.body.group === "G4"
		) {
			sql_update =
				"UPDATE iotglove_" +
				req.body.group +
				" SET game_state = 'activate' ,device_state = 'photo', life_chip = 1";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
			console.log(sql_update);
			sql_update =
				"UPDATE device SET shift_machine = shift_machine+1 WHERE device_name like '" +
				req.body.group +
				"%'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}
	}
	if (
		req.body.command === "player_select" ||
		req.body.command === "photo_state"
	) {
		// console.log(req.body)
		sql_update =
			"UPDATE device SET theme = '" +
			req.body.theme +
			"' WHERE device_name like '" +
			req.body.group +
			"%'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		console.log(sql_update);
		//술래만 지정
		sql_update =
			"UPDATE iotglove_" + req.body.group + " SET role = 'tagger' WHERE ";
		for (let i = 0; i < req.body.tagger.length; i++) {
			//req.body.player 배열에서 술래 없애기
			req.body.player.splice(req.body.player.indexOf(req.body.tagger[i]), 1);
			console.log("req.body.player: ", req.body.player);

			if (i === req.body.tagger.length - 1) {
				sql_update += "device_name = '" + req.body.tagger[i] + "'";
				break;
			}
			sql_update += "device_name = '" + req.body.tagger[i] + "' OR ";
		}
		// console.log(sql_update)
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});

		//선택된 플레이어 생존자로 변경
		for (let i = 0; i < req.body.player.length; i++) {
			let player_name = i + 1;
			sql_update =
				"UPDATE iotglove_" +
				req.body.group +
				" SET role = 'player', player_name = '" +
				player_name +
				"' WHERE device_name = '" +
				req.body.player[i] +
				"' AND role NOT in ('tagger')";
			// console.log(sql_update)
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}

		sql_update =
			"UPDATE device SET shift_machine = 2 WHERE device_name like '" +
			req.body.group +
			"%'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.command === "role_change") {
		//유령, 플레이어 전환
		sql_update =
			"UPDATE iotglove_" +
			req.body.glove.substring(0, 2) +
			" SET role = '" +
			req.body.role +
			"' WHERE device_name = '" +
			req.body.glove +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_reset =
			"UPDATE device SET shift_machine = 2 WHERE device_name = '" +
			req.body.glove +
			"'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.command === "exp_change") {
		sql_update =
			"UPDATE iotglove_" +
			req.body.glove.substring(0, 2) +
			" SET exp = " +
			req.body.exp +
			", lv = lv + 1, skill_point = skill_point + 1, max_exp = max_exp + 10 WHERE device_name = '" +
			req.body.glove +
			"'";
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_reset =
			"UPDATE device SET shift_machine = 2 WHERE device_name = '" +
			req.body.glove +
			"'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
	} else if (req.body.command === "tagger_blink") {
		console.log("tagger_blink");
		let group;
		sql_update =
			"SELECT device_name FROM device where theme = '" +
			req.body.theme +
			"' AND device_type = 'iotglove'";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			group = rows[0].device_name.substring(0, 2);
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
			sql_update =
				"UPDATE iotglove_" +
				group +
				" SET game_state = 'activate', device_state = IF(role = 'tagger','blink','activate')";
			console.log(sql_update);
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
			sql_reset =
				"UPDATE device SET shift_machine = 2 WHERE device_name like '" +
				group +
				"%'";
			console.log(sql_reset);
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
		});
	}
	res.end();
});
app.post("/api/reset/iotglove", (req, res) => {
	let sql_reset;
	iotglove_refresh_request = true;
	if (req.body.command === "reset") {
		if (
			req.body.group === "G1" ||
			req.body.group === "G2" ||
			req.body.group === "G3" ||
			req.body.group === "G4"
		) {
			sql_reset = "TRUNCATE iotglove_" + req.body.group;
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
			sql_reset =
				"insert into iotglove_" +
				req.body.group +
				" select b.device_name,a.* from iotglove as a, device as b where a.device_type=b.device_type and b.device_name like '" +
				req.body.group +
				"%'";
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
			sql_reset =
				"UPDATE device SET shift_machine = 2, theme = 'waiting' WHERE device_name like '" +
				req.body.group +
				"%'";
			// sql_reset = "UPDATE device SET shift_machine = shift_machine+1 WHERE device_name like '"+req.body.group+"%'";
			connection.query(sql_reset, (err, rows) => {
				if (err)
					res.send(sql_reset + " query is not excuted. select fail...\n" + err);
			});
		}
	}
	res.end();
});

app.post("/api/update/all", (req, res) => {
	let sql_update;
	console.log(req.body);
	cyberpunk_refresh_request = true;
	iotglove_refresh_request = true;
	if (req.body.state === "player_lose" || req.body.state === "player_win") {
		for (let i = 0; i < device_list.length; i++) {
			sql_update =
				"UPDATE " +
				req.body.theme +
				"_" +
				device_list[i] +
				" set device_state = '" +
				req.body.state +
				"'";
			connection.query(sql_update, (err, rows) => {
				if (err)
					res.send(
						sql_update + " query is not excuted. select fail...\n" + err
					);
			});
		}
		sql_update =
			"UPDATE iotglove_" +
			req.body.glove +
			" set device_state = '" +
			req.body.state +
			"'";
		console.log(sql_update);
		connection.query(sql_update, (err, rows) => {
			if (err)
				res.send(sql_update + " query is not excuted. select fail...\n" + err);
		});
		sql_reset =
			"UPDATE device set shift_machine = 2 where theme = '" +
			req.body.theme +
			"'";
		connection.query(sql_reset, (err, rows) => {
			if (err)
				res.send(sql_reset + " query is not excuted. select fail...\n" + err);
		});
	}
});
app.listen(port, () => console.log(`Listening on port ${port}`));
