var express = require('express');
var router = express.Router();

var promise = require('bluebird');
var options = {promiseLib: promise};
var pgp = require('pg-promise')(options);
var conn_params = {
	host: "localhost",
	port: 5432,
	database: 'kltn_gis',
	user:'quangkhanh',
	password: 'admin'
};

var db = pgp(conn_params);
pgp.pg.types.setTypeParser(1114, function (stringValue) {
    return stringValue;
});

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session.authenticated);
	if(req.session.authenticated){
		res.render('home',{auth : true, name : req.session.name, role: req.session.role});
	} else {
		res.render('home');
	}
});
//thuadat
router.get('/thuadat/:gid',function (req,res) {
	var gid = req.params.gid;
	var sql = "SELECT shbando,shthua,dtpl,sonha,tenduong,phuong, thanhpho,tinh,loaidat.tenloai " +
			 "FROM thuadat " +
			 "LEFT JOIN giaychungnhan ON thuadat.shgiaycn = giaychungnhan.shgiaycn " +
			 "LEFT JOIN loaidat ON loaidat.maloai = giaychungnhan.mucdichsudung " +
			 "WHERE gid=$1"
	db.oneOrNone(sql,gid).then(function(data){
		res.status(200).jsonp({
			status: "success",
			data: data
		});
	}).catch(function(error){
		console.log("ERROR: ",error);
	});
});
router.get('/thuadat/:soto/:sothua',function (req,res) {
	var soto = req.params.soto;
	var sothua =req.params.sothua;
	var sql = "SELECT shbando,shthua,dtpl,sonha,tenduong,phuong, thanhpho,tinh,loaidat.tenloai, gid " +
			 "FROM thuadat " +
			 "LEFT JOIN giaychungnhan ON thuadat.shgiaycn = giaychungnhan.shgiaycn " +
			 "LEFT JOIN loaidat ON loaidat.maloai = giaychungnhan.mucdichsudung " +
			 "WHERE shbando=$1 AND shthua=$2"
	db.oneOrNone(sql,[soto,sothua]).then(function(data){
		res.status(200).jsonp({
			status: "success",
			data: data
		});
	}).catch(function(error){
		console.log("ERROR: ",error);
	});
});
//giay chung nhan
router.get('/gcn/search',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1){
		next();
	}
	var shgiaycn = req.query.sogiay;
	var sql_gcn = "SELECT * FROM giaychungnhan WHERE shgiaycn=$1";
	var sql_thuadat = "SELECT gid,shthua,shbando FROM thuadat WHERE shgiaycn =$1";
	var sql_chudat = "SELECT a.machu,ten FROM chusudung a INNER JOIN chusudung_giaychungnhan b ON a.machu = b.machu WHERE shgiaycn = $1";
	db.any(sql_thuadat,shgiaycn).then(data => {
		var thuadat = [];
		if(!data) {
			return;
		}
		for(var i = 0; i < data.length; i++){
			var element = {};
			element.gid = data[i].gid;
			element.shthua = data[i].shthua;
			element.shbando = data[i].shbando;
			thuadat.push(element);
		}
		db.any(sql_chudat,shgiaycn).then(data =>{
			var chudat = [];
			for(var i = 0; i < data.length; i++){
				var element = {};
				element.machu = data[i].machu;
				element.ten = data[i].ten;
				chudat.push(element);
			}
			db.oneOrNone(sql_gcn,shgiaycn).then(data =>{
				if(thuadat.length != 0){
					data.thuadat = thuadat;
				}
				if(chudat.length != 0){
					data.chudat = chudat;
				}
				res.status(200).jsonp({
					status: 'success',
					data: data
				})
			});
		});
	}).catch(error => {
		console.log(error);
	});

});
router.get('/gcn/getlist',function(req,res){
	var sql = 'SELECT tenchu,namsinh,socmnd,diachi,giaychungnhan.shgiaycn,sericn,ngayvs,chinhly,dtrieng,dtchung ' +
				'FROM chusudung_giaychungnhan ' +
				'INNER JOIN chusudung ON chusudung_giaychungnhan.machu = chusudung.machu ' +
				'INNER JOIN giaychungnhan ON chusudung_giaychungnhan.shgiaycn = giaychungnhan.shgiaycn';
	db.any(sql).then(data =>{
		res.status(200).jsonp({
			status: "success",
			data: data
		});
	});
});
router.get('/gcn/get',function(req,res){
	var cmnd = req.query.cmnd;
	if(!cmnd) {
		res.status(200).jsonp({
			status: "error",
		});
	};
	var sql;
	if(!req.session.role){
		sql = 'SELECT magcn.ten,magcn.shgiaycn,td.shthua, td.shbando, td.sonha, td.tenduong, td.phuong, td.thanhpho, td.tinh ' +
				'FROM (SELECT * FROM chusudung_giaychungnhan cg INNER JOIN (SELECT * FROM chusudung WHERE sogiayto = $1) c ON c.machu = cg.machu) magcn ' +
				'INNER JOIN giaychungnhan gcn ON gcn.shgiaycn = magcn.shgiaycn ' +
				'INNER JOIN thuadat td ON td.shgiaycn = magcn.shgiaycn ' +
				'INNER JOIN loaidat ld ON gcn.mucdichsudung = ld.maloai ';
	} else {
		sql = 'SELECT magcn.*,td.shthua, td.shbando, td.sonha, td.tenduong, td.phuong, td.thanhpho, td.tinh, td.dtpl, ' +
				'gcn.ngayki,gcn.coquancap,gcn.chinhly,gcn.dtrieng,gcn.dtchung,ld.tenloai,gcn.thoihansudung,gcn.nguongocsudung ' +
				'FROM (SELECT * FROM chusudung_giaychungnhan cg INNER JOIN (SELECT * FROM chusudung WHERE sogiayto = $1) c ON c.machu = cg.machu) magcn ' +
				'INNER JOIN giaychungnhan gcn ON gcn.shgiaycn = magcn.shgiaycn ' +
				'INNER JOIN thuadat td ON td.shgiaycn = magcn.shgiaycn ' +
				'INNER JOIN loaidat ld ON gcn.mucdichsudung = ld.maloai ';
	}
	db.any(sql,cmnd).then(data => {
		res.status(200).jsonp({
			status: "success",
			data: data
		});
	}).catch(function(error){
		console.log("ERROR: ",error);
		res.status(200).jsonp({
			status: "error"
		});
	});
});
router.get('/gcn/isgcn',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var soto = req.query.soto;
	var sothua = req.query.sothua;

	var sql = "SELECT gid,shgiaycn FROM thuadat WHERE shbando = $1 AND shthua = $2";
	db.oneOrNone(sql,[soto,sothua]).then(data => {
		if(data.shgiaycn) {
			res.status(200).jsonp({
				status: 'existed',
				data: data
			});
		} else {
			res.status(200).jsonp({
				status: 'ok',
				data:data
			});
		}
	}).catch( error => {
		console.log(error);
		res.status(500);
	});
});
router.post('/gcn/update',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var shgiaycn = req.body.shgiaycn;
	var ngayky = req.body.ngayky;
	var coquancap = req.body.coquancap;
	var dtrieng = req.body.dtrieng;
	var dtchung = req.body.dtchung;
	var mucdich = req.body.mucdich;
	var thoihan = req.body.thoihan;
	var nguongoc = req.body.nguongoc;
	var chudat = req.body.chudat;
	var thuadat = req.body.thuadat;
	var sql_getChinhLy = "SELECT chinhly FROM giaychungnhan WHERE shgiaycn=$1";
	db.oneOrNone(sql_getChinhLy,shgiaycn).then(data =>{
		var chinhly = data.chinhly;
		var sql_gcn = "UPDATE giaychungnhan SET ngayki=$1,coquancap=$2,dtrieng=$3,dtchung=$4,mucdichsudung=$5,thoihansudung=$6,nguongocsudung=$7,chinhly=$8 WHERE shgiaycn=$9";
		db.none(sql_gcn,[ngayky,coquancap,dtrieng,dtchung,mucdich,thoihan,nguongoc,chinhly+1,shgiaycn]).catch(error=>{
			console.log('update chung nhan');
			console.log(error);
		});
		var sql_deletechudat = "DELETE FROM chusudung_giaychungnhan WHERE shgiaycn=$1";
		db.none(sql_deletechudat,shgiaycn).catch(error=>{
			console.log('delete csd gcn');
			console.log(error);
		});
		var sql_deletethuadat = "UPDATE thuadat SET shgiaycn=null WHERE shgiaycn=$1";
		db.none(sql_deletethuadat,shgiaycn).catch(error=>{
			console.log('update thuadat');
			console.log(error);
		});
		var sql_gcnchudat = "INSERT INTO chusudung_giaychungnhan(machu,shgiaycn) VALUES ($1,$2)";
		var sql_thuadat = "UPDATE thuadat SET shgiaycn=$1 WHERE gid=$2";
		for(var i =0; i < chudat.length; i++) {
			db.none(sql_gcnchudat,[chudat[i],shgiaycn]).catch(error =>{
				console.log(error);
			});
		}
		for(var j =0; j < thuadat.length; j++){
			console.log(thuadat[j]);
			db.none(sql_thuadat,[shgiaycn,thuadat[j]]).catch(error =>{
				console.log(error);
			})
		}
		res.status(200).jsonp({
			status: 'success'
		});
	}).catch(error => {
		console.log("Chinh ly");
		console.log(error);
	});
});
router.get('/gcn/delete',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var shgiaycn = req.query.sogiay;
	var sql_deletethuadat = "UPDATE thuadat SET shgiaycn=null WHERE shgiaycn=$1";
	db.none(sql_deletethuadat,shgiaycn).catch(error=>{
		console.log('update thuadat');
		console.log(error);
	});
	var sql_deletechudat = "DELETE FROM chusudung_giaychungnhan WHERE shgiaycn=$1";
	db.none(sql_deletechudat,shgiaycn).catch(error=>{
		console.log('delete csd gcn');
		console.log(error);
	});
	var sql_deletegcn = "DELETE FROM giaychungnhan WHERE shgiaycn=$1 RETURNING 1";
	db.oneOrNone(sql_deletegcn,shgiaycn).then(data =>{
		if(data){
			res.status(200).jsonp({
				status: 'success'
			});
		} else {
			res.status(400).jsonp({
				status: 'fail'
			})
		}
	}).catch(error=>{
		console.log(error);
	});
});
router.post('/gcn/insert',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var sogiaycn = req.body.sogiaycn;
	var ngayky = (req.body.ngayky)?req.body.ngayky:null;
	var coquancap = req.body.coquancap;
	var dtrieng = (req.body.dtrieng)?req.body.dtrieng:0;
	var dtchung = (req.body.dtchung)?req.body.dtchung:0;
	var mucdich = req.body.mucdich;
	var thoihan = (req.body.thoihan)?req.body.thoihan:null;
	var nguongoc = req.body.nguongoc;
	var chudat = req.body.chudat;
	var thuadat = req.body.thuadat;


	var sql_insertgcn = "INSERT INTO giaychungnhan(ngayki,coquancap,dtrieng,dtchung,mucdichsudung,thoihansudung,nguongocsudung,chinhly,shgiaycn)"
						+ " VALUES($1,$2,$3,$4,$5,$6,$7,0,$8) RETURNING shgiaycn";	
	db.one(sql_insertgcn,[ngayky,coquancap,dtrieng,dtchung,mucdich,thoihan,nguongoc,sogiaycn]).then(data => {
		if(data.shgiaycn) {
			var sql_gcnchudat = "INSERT INTO chusudung_giaychungnhan(machu,shgiaycn) VALUES ($1,$2)";
			var sql_thuadat = "UPDATE thuadat SET shgiaycn=$1 WHERE gid=$2";
			for(var i =0; i < chudat.length; i++) {
				db.none(sql_gcnchudat,[chudat[i],data.shgiaycn]).catch(error =>{
					console.log(error);
				});
			}
			for(var j =0; j < thuadat.length; j++){
				db.none(sql_thuadat,[data.shgiaycn,thuadat[j]]).catch(error =>{
					console.log(error);
				})
			}
			res.status(200).jsonp({
				status: 'success'
			});
		}
	}).catch(error => {
		console.log(error);
	});

})
//Chu dat
router.post('/chudat/insert',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var ten = req.body.ten;
	var quoctich = req.body.quoctich;
	var diachi = req.body.diachi;
   	var loai = req.body.loai;
	if(loai == 1) {
		var nam = req.body.nam;
		var cmnd = req.body.cmnd;
		
		var sql = "SELECT 1 FROM chusudung WHERE sogiayto=$1";
		db.one(sql,cmnd).then(result => {
			res.status(200).jsonp({
				status: 'error'
			});
		}).catch(error => {
			
			sql = "INSERT INTO chusudung(loaichu,ten,nam,sogiayto,diachi,quoctich) VALUES ($1,$2,$3,$4,$5,$6) RETURNING 1;";
			db.one(sql,[loai,ten,nam,cmnd,diachi,quoctich]).then(data => {
				if(data) {
					res.status(200).jsonp({
						status: 'success'
					});
				}
			}).catch(error => {
				console.log(error);
				res.status(200).jsonp({
					status: 'error'
				})
			})
		});
	} else if(loai == 2){
		var sql = "SELECT 1 FROM chusudung WHERE ten=$1 AND diachi=$2";
		db.one(sql,[ten,diachi]).then(result =>{
			res.status(200).jsonp({
				status: 'error'
			});
		}).catch(error => {
			sql = "INSERT INTO chusudung(loaichu,ten,diachi,quoctich) VALUES ($1,$2,$3,$4) RETURNING 1;";
			db.one(sql,[loai,ten,diachi,quoctich]).then(data => {
				if(data) {
					res.status(200).jsonp({
						status: 'success'
					});
				}
			}).catch(error => {
				console.log(error);
				res.status(200).jsonp({
					status: 'error'
				});
			});
		});
	} else {
		var sogiayto = req.body.sogiayto;
		var ngaycap = req.body.ngaycap;
		var sql = "SELECT 1 FROM chusudung WHERE sogiayto=$1";
		db.one(sql,sogiayto).then(result => {
			res.status(200).jsonp({
				status: 'error'
			});
		}).catch(error => {
			
			sql = "INSERT INTO chusudung(loaichu,ten,sogiayto,diachi,quoctich,ngaycap) VALUES ($1,$2,$3,$4,$5,$6) RETURNING 1;";
			db.one(sql,[loai,ten,sogiayto,diachi,quoctich,ngaycap]).then(data => {
				if(data) {
					res.status(200).jsonp({
						status: 'success'
					});
				}
			}).catch(error => {
				console.log(error);
				res.status(200).jsonp({
					status: 'error'
				})
			})
		});
	}
});
router.get('/chudat/search',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var cmnd = req.query.cmnd;
	var sql = "SELECT machu,loaichu,ten,nam,sogiayto,ngaycap,diachi,quoctich FROM chusudung WHERE sogiayto=$1";
	db.oneOrNone(sql,[cmnd]).then(data => {
		if(data) {
			res.status(200).jsonp({
				status: "success",
				data:data
			});
		} else {
			res.status(200).jsonp({
				status: "not found",
				data: null
			});
		}
	});
});
router.get('/chudat/delete',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var machu = req.query.machu;
	var sql = "DELETE FROM chusudung WHERE machu=$1 RETURNING 1;";
	db.one(sql,machu).then(data => {
		if(data){
			res.status(200).jsonp({
				status: 'success'
			})
		}
	}).catch(error => {
		console.log(error.detail);
		res.status(200).jsonp({
				status: 'error'
		})
	})
});
router.post('/chudat/update',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
    var machu = req.body.machu;
    var ten = req.body.ten;
	var quoctich = req.body.quoctich;
	var diachi = req.body.diachi;
   	var loai = req.body.loai;
   	if(loai == 1){
   		var nam = req.body.nam;
		var cmnd = req.body.cmnd;
		var sql = "UPDATE chusudung SET ten=$1,nam=$2,loaichu=$3,sogiayto=$4,diachi=$5,quoctich=$6 WHERE machu=$7 RETURNING 1";
		db.oneOrNone(sql,[ten,nam,loai,cmnd,diachi,quoctich,machu]).then(data => {
			if(data) {
				res.status(200).jsonp({
					status: 'success'
				});
			}
		}).catch(error => {
			console.log(error);
			res.status(400).jsonp({
				status: 'error'
			});
		});
   	} else if(loai ==2) {
   		var sql = "UPDATE chusudung SET ten=$1,loaichu=$2,diachi=$3,quoctich=$4 WHERE machu=$5 RETURNING 1";
   		db.oneOrNone(sql,[ten,loai,diachi,quoctich,machu]).then(data => {
			if(data) {
				res.status(200).jsonp({
					status: 'success'
				});
			}
		}).catch(error => {
			console.log(error);
			res.status(400).jsonp({
				status: 'error'
			});
		});
   	} else {
   		var sogiayto = req.body.sogiayto;
		var ngaycap = req.body.ngaycap;
		var sql = "UPDATE chusudung SET ten=$1,loaichu=$2,diachi=$3,quoctich=$4,sogiayto=$5,ngaycap=$6 WHERE machu=$7 RETURNING 1";
		db.oneOrNone(sql,[ten,loai,diachi,quoctich,sogiayto,ngaycap,machu]).then(data => {
			if(data) {
				res.status(200).jsonp({
					status: 'success'
				});
			}
		}).catch(error => {
			console.log(error);
			res.status(400).jsonp({
				status: 'error'
			});
		});
   	}
});
router.get('/chudat/getbyname',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var ten = req.query.ten;
	var sql = "SELECT machu, ten, diachi FROM chusudung WHERE ten=$1";
	db.any(sql,ten).then(data =>{
		if(data) {
			res.status(200).jsonp({
				status: 'success',
				data: data
			});
		} else {
			res.status(204).jsonp({
				status: 'No data'
			})
		}
	}).catch(error => {
		console.log(error);
		res.status(404).jsonp({
			status: 'error'
		})
	});
});
router.get('/chudat/getbyid',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var id = req.query.id;
	var sql = "SELECT machu, ten, diachi FROM chusudung WHERE sogiayto=$1";
	db.any(sql,id).then(data =>{
		if(data) {
			res.status(200).jsonp({
				status: 'success',
				data: data
			});
		} else {
			res.status(204).jsonp({
				status: 'No data'
			})
		}
	}).catch(error => {
		console.log(error);
		res.status(404).jsonp({
			status: 'error'
		})
	});
});
//Loai dat
router.get('/loaidat/get',function(req,res){
	var sql = "SELECT maloai, tenloai FROM loaidat";
	db.any(sql).then(data => {
		if(data) {
			res.status(200).jsonp({
				status: 'success',
				data: data
			});
		} else {
			res.status(204).jsonp({
				status: 'No data'
			})
		}
	}). catch(error => {
		console.log(error);
		res.status(404).jsonp({
			status: 'error'
		})
	})
});
//Văn bản
router.post('/vanban/insert',function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1) {
		next();
	}
	var sohieu = req.body.sohieu;
	var noidung = req.body.noidung;
	var link = req.body.link;
	var sql = "INSERT INTO vanbannhanuoc(sohieu,noidung,link) VALUES ($1,$2,$3) RETURNING id";
	db.oneOrNone(sql,[sohieu,noidung,link]).then(data =>{
		if(data){
			res.status(201).jsonp({
				status: "success"
			});
		} else {
			res.status(500).jsonp({
				status: "Fail"
			})
		}
	}).catch(error =>{
		res.status(500);
		console.log(error);
	})

});
router.get('/vanban/getlist',function(req,res){
	var sql = "SELECT * FROM vanbannhanuoc";
	db.any(sql).then(data =>{
		if(data){
			res.status(201).jsonp({
				status: "success",
				data: data
			});
		} else {
			res.status(500).jsonp({
				status: "Fail"
			})
		}
	}).catch(error =>{
		res.status(500);
		console.log(error);
	})
});
//Người dùng
router.post("/nguoidung/insert",function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1){
		next();
	}
	var user = req.body.user;
	var hoten = req.body.hoten;
	var cmnd = req.body.cmnd;
	var diachi = req.body.diachi;
	var chucvu = req.body.chucvu;

	var sql = "INSERT INTO taikhoan(username,hoten,cmnd,diachi,chucvu) VALUES ($1,$2,$3,$4,$5) RETURNING 1";
	db.one(sql,[user,hoten,cmnd,diachi,chucvu]).then(data=>{
		if(data){
			res.status(200).jsonp({
				status: "success"
			})
		} else {
			res.status(500).jsonp({
				status: "fail"
			});
		}
	}).catch(error=>{
		console.log(error);
		res.status(500);
	});
});
router.get("/nguoidung/getlist",function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1){
		next();
	}
	var sql = "SELECT id,username,hoten,cmnd,diachi,chucvu FROM taikhoan"
	db.any(sql).then(data=>{
		if(data) {
			res.status(200).jsonp({
				status: 'success',
				data:data
			});
		} else {
			res.status(404).jsonp({
				status: 'fail'
			});
		}
	}).catch(error=>{
		console.log(error);
		res.status(500);
	})
});
router.get("/nguoidung/get",function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1){
		next();
	}
	var loai = req.query.loai;
	var content = req.query.content;
	var sql="SELECT id,username,hoten,cmnd,diachi,chucvu FROM taikhoan ";
	if(loai == 1) {
		sql +=  "WHERE username=$1";
	} else {
		sql += "WHERE hoten=$1";
	}
	db.any(sql,content).then(data=>{
		if(data) {
			res.status(200).jsonp({
				status: 'success',
				data:data
			});
		} else {
			res.status(404).jsonp({
				status: 'fail'
			});
		}
	}).catch(error=>{
		console.log(error);
		res.status(500);
	});
});
router.post("/nguoidung/update",function(req,res,next){
	if(!req.session.authenticated && req.session.role != 1){
		next();
	}
	var id = req.body.id;
	var hoten = req.body.hoten;
	var cmnd = req.body.cmnd;
	var diachi = req.body.diachi;
	var chucvu = req.body.chucvu;

	var sql = "UPDATE taikhoan SET hoten=$1,cmnd=$2,diachi=$3,chucvu=$4 WHERE id=$5 RETURNING 1";
	db.oneOrNone(sql,[hoten,cmnd,diachi,chucvu,id]).then(data=>{
		if(data) {
			res.status(200).jsonp({
				status: 'success',
			});
		} else {
			res.status(404).jsonp({
				status: 'fail'
			});
		}
	}).catch(error=>{
		console.log(error);
		res.status(500);
	});
});
router.get("/nguoidung/getaccesscontrol",function(req,res,next){
	var role = (!req.session.role)?null:req.session.role;
	res.status(200).jsonp({
		role: role
	});
});
router.post('/login',function(req,res,next){
	if(req.session.authenticated) {
		next();
	}
	var user = req.body.username;
	var pass = req.body.password;
	var sql = "select id,username,hoten,chucvu from taikhoan where username = $1 and password = $2";
	db.oneOrNone(sql,[user,pass]).then(data => {
		if(data) {
			req.session.authenticated = true;
			req.session.accountid = data.id;
			req.session.name = (data.hoten)?data.hoten:data.username;
			req.session.role = data.chucvu;
			res.redirect('/');
		} else {
			req.session.authenticated = false;
			res.status(404).jsonp({
				status: 'Tài Khoản không đúng!'
			});
			res.redirect('/');
		}
	});
});
router.post('/changepassword',function(req,res,next){
	if(!req.session.authenticated) {
		next();
	}
	var old = req.body.oldpassword;
	var newpass = req.body.newpassword;
	var sql = "select password from taikhoan where id= $1";
	db.oneOrNone(sql,req.session.accountid).then(data=>{
		if(data.password) {
			if(old==data.password){
				sql = "update taikhoan set password=$1 where id=$2 returning 1";
				db.oneOrNone(sql,[newpass,req.session.accountid]).then(data =>{
					if(data) {
						res.status(200).jsonp({
							status: 'success'
						});
						res.redirect('/');
					} else {
						res.status(500).jsonp({
							status: 'fail'
						});
					}
				}).catch(error =>{
					console.log(error);
				});
			} else {
				res.redirect('/');
			}
		} else {
			res.status(404).json({
				status: 'notfound'
			});
		}
	}).catch(error=>{
		console.log(error);
	});
})
router.get('/logout',function(req,res,next){
	if(!req.session.authenticated) {
		next();
	}
	delete req.session.authenticated;
	req.session.destroy();
	res.redirect('/');
});
module.exports = router;
