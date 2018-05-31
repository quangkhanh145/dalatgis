var tracuuthuadat = new TraCuuThuaDat();
var tracuugiaychungnhan = new TraCuuGiayChungNhan();
var quanlychudat = new QuanLyChuDat();
var quanlygiaychungnhan = new QuanLyGiayChungNhan();
var quanlyvanban = new QuanLyVanBanNhaNuoc();
var quanlynguoidung = new QuanLyNguoiDung();
var thongtin = new ThongTin();
map.on('click',onMouseClick);
function onMouseClick(e) {
	tracuuthuadat.mouseClick(e);
}
$("#login").click(function(){
  $("#login-panel").dialog({
    autoOpen: false,

    close: function(){
      $(this).dialog('destroy');
    }
  });
  $("#login-panel").dialog('open');
});

$("#tracuuthuadat").click(function() {
  tracuuthuadat.openDialog();
});
$("#tracuugcn").click(function() {
  tracuugiaychungnhan.openDialog();
});

$('#qlchudat').click(function(){
  quanlychudat.openDialog();
});
$('#qlgcn').click(function(){
  quanlygiaychungnhan.openDialog();
});
$('#qlnguoidung').click(function(){
  quanlynguoidung.openDialog();
});
$("#qlvanban").click(function(){
  quanlyvanban.openDialog();
});

$("#tracuuvanbannhanuoc").click(function(){
  quanlyvanban.openSearchDialog();
});

$("#info").click(function(){
  thongtin.openDialog();
});
$('#changePassword').click(function(e){
  e.preventDefault();
  $("#change-pass-panel").dialog({
    autoOpen: false,
    close: function(){
      $(this).dialog("destroy");
    }
  });
  $("#change-pass-panel").dialog('open');
});
function getRole() {
  $.getJSON("http://"+host+"/nguoidung/getaccesscontrol",function(json){
    if(json){
      return json.role;
    } else {
      return null;
    }
  });
}
function onlyNumbers(event) {
  return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) );
}

function createOneRowResult(line1,line2,click_function1,click_function2) {
  var container = document.createElement('div');
  container.classList.add("row");
  container.classList.add("bg-lightblue");
  container.classList.add("p-1");
  container.classList.add("mb-1");
  container.classList.add("rounded");

  var l1 = document.createElement('div');
  l1.classList.add("col-md-9");
  l1.classList.add("text-light");
  l1.classList.add("font-weight-normal");
  l1.classList.add("result-title");
  l1.append(document.createTextNode(line1));

  container.append(l1);

  var btns = document.createElement('div');
  btns.classList.add("col-md-3");
  btns.classList.add("text-light");
  btns.classList.add("font-weight-light");
  btns.classList.add("font-italic");
  btns.classList.add("result-extra");
  var btnSua = document.createElement('span');
  btnSua.textContent = "Sửa";
  btnSua.classList.add("col-md-1");
  btnSua.classList.add("result-btn");
  btnSua.onclick = function(){
    click_function2();
  };

  var btnXoa = document.createElement('span');
  btnXoa.textContent = "Xóa";
  btnXoa.classList.add("col-md-1");
  btnXoa.classList.add("result-btn");
  btnXoa.onclick = function(){click_function1();};
  
  btns.append(btnSua);
  btns.append(btnXoa);


  container.append(btns);

  var l2 = document.createElement('div');
  l2.classList.add("col-md-9");
  l2.classList.add("text-light");
  l2.classList.add("font-weight-light");
  l2.classList.add("font-italic");
  l2.classList.add("result-extra");
  l2.append(document.createTextNode(line2));

  container.append(l2);

  container.onmouseover = function(){
    container.classList.remove("bg-lightblue");
    container.classList.add("bg-smalt");
  };
  container.onmouseout = function(){
    container.classList.remove("bg-smalt");
    container.classList.add("bg-lightblue");
  }

  return container;
}
function createRowWithInputButton(textLabel,textButton,id) {
  var row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("form-group");
  row.classList.add("col-md-12");

  var label = document.createElement("label");
  label.classList.add("col-md-5");
  label.textContent = textLabel;

  var input = document.createElement("input");
  input.classList.add("col-md-4");
  input.classList.add('form-control');
  input.type = "text";
  input.id = id;
  input.style.height = '40px';


  var button = document.createElement("button");
  button.classList.add("col-md-2");
  button.classList.add("offset-md-1");
  button.classList.add("ui-button");
  button.classList.add("ui-corner-all ui-widget");
  button.type = "submit";
  button.id = "btnSearch";
  button.textContent = textButton;
  button.style.height = '40px';

  row.append(label);
  row.append(input);
  row.append(button);

  return row;
}
function createRowWithSmallInput(text,id,type,keydown) {
  var row = document.createElement("div");
  row.classList.add("row");

  var label = document.createElement("label");
  label.classList.add("col-md-4");
  label.classList.add("control-label");
  label.textContent = text;

  var input = document.createElement("input");
  input.classList.add("col-md-8");
  input.classList.add("form-control");
  input.type = type;
  input.id = id;
  if(keydown == true){
    input.onkeydown = function (e) {
      return onlyNumbers(e);
    };
  }
  row.append(label);
  row.append(input);
  return row;
}
function createRowWithLargeInput(text,id,type,keydown) {
  var row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("form-group");
  row.classList.add("col-md-12");

  var label = document.createElement("label");
  label.classList.add("col-md-6");
  label.classList.add("control-label");
  label.textContent = text;

  var input = document.createElement("input");
  input.classList.add("form-control");
  input.classList.add("col-md-6");
  if(type=='year'){
  	input.type = text;
  	$(input).attr('maxlength','4');
  } else {
  	input.type = type;
  }
  input.id = id;
  if(keydown == true){
    input.onkeydown = function (e) {
      	return onlyNumbers(e);
    };
  }
  row.append(label);
  row.append(input);
  return row;
}
function createRowWithSelect(txtLabel,id,content,value){
	var row = document.createElement("div");
  	row.classList.add("row");
  	row.classList.add("form-group");
  	row.classList.add("col-md-12");

  	var label = document.createElement("label");
  	label.classList.add("col-md-6");
    label.classList.add("control-label");
  	label.textContent = txtLabel;

  	var selectbox = document.createElement('select');
  	selectbox.id = id;
  	selectbox.classList.add('form-control');
  	selectbox.classList.add('col-md-6');
	selectbox.style.marginTop = "10px";

  	for(var i = 0; i < content.length; i++){
  		var option = document.createElement('option');
  		option.textContent = content[i];
  		option.value = value[i];
  		selectbox.appendChild(option);
  	}
  	row.append(label);
  	row.append(selectbox);
  	return row;
}
function createRowWithText(text,id) {
  var row = document.createElement("div");
  row.classList.add("row");

  var label = document.createElement("label");
  label.classList.add("col-md-6");
  label.classList.add("control-label");
  label.textContent = text;

  var info = document.createElement("div");
  info.classList.add("col-md-6");
  info.id = id;

  row.append(label);
  row.append(info);
  return row;
};

function createSelectBoxCountry(){
  var select = document.createElement('select');
  select.classList.add('form-control');
  select.classList.add('col-md-6');
  select.id = "iQuocTich";

  a = ['United States','United Kingdom','Afghanistan','Albania','Algeria','American Samoa','Andorra','Angola','Anguilla','Antarctica',
      'Antigua and Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus',
      'Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Bouvet Island','Brazil','British Indian Ocean Territory',
      'Brunei Darussalam','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Central African Republic','Chad',
      'Chile','China','Christmas Island','Cocos (Keeling) Islands','Colombia','Comoros','Congo','Congo, The Democratic Republic of The','Cook Islands','Việt Nam'];
  for(var i = 0; i < a.length; i++) {
    var option = document.createElement('option');
    option.textContent = a[i];
    option.value = a[i];
    select.append(option);
  }
  select.selectedIndex = a.length - 1;
  return select;

}


function formatDate(date) {
  let dt = new Date(date);    
  let dd = dt.getDate();
  let mm = dt.getMonth()+1; 
  let yyyy = dt.getFullYear();
  if(dd<10){
    dd='0'+dd;
    } 
  if(mm<10){
      mm='0'+mm;
    } 
  return yyyy+'-'+mm+'-'+ dd;
}
function formatDate2(date) {
  let dt = new Date(date);    
  let dd = dt.getDate();
  let mm = dt.getMonth()+1; 
  let yyyy = dt.getFullYear();
  if(dd<10){
    dd='0'+dd;
    } 
  if(mm<10){
      mm='0'+mm;
    } 
  return dd+'-'+mm+'-'+yyyy;
}
function formatAddress(sonha,tenduong,phuong,thanhpho,tinh) {
	var diachi = '';
	if(sonha === null && tenduong === null && phuong === null && thanhpho === null && tinh === null){
    	diachi = "Chưa cập nhật";
  	} else {
    	if(sonha != null) diachi += sonha + " ";
    	if(tenduong != null) diachi += tenduong + "-";
    	if(phuong != null) diachi += "Phường " + phuong + "-";
    	if(thanhpho != null) diachi += thanhpho + "-";
    	if(tinh != null) diachi += tinh;
  	}
  	return diachi;
}
function TraCuuThuaDat() {
	var searchDialog = document.createElement('div');
	var informationDialog = document.createElement('div');
	var hasSearchDialog = false;
	var hasInformationDialog = false;
  var searchedFeature = null;
	this.openDialog = function() {
		this.createSearchDialog();
		this.CreateInformationDialog();
		$(searchDialog).dialog('open');
	}
	this.mouseClick = function (e) {
    if(searchedFeature) {
      searchedFeature.setStyle(null);
      selectInteraction.getFeatures().clear();
    }
		this.CreateInformationDialog();
		var coordinate = e.coordinate;
  		var pixel = map.getPixelFromCoordinate(coordinate);
  		map.forEachFeatureAtPixel(pixel, function(feature){
    		var request_string= "http://"+host+"/thuadat/" + feature.get('gid');
        searchedFeature=feature;
    		$.getJSON(request_string,function(json){
      			hienThiThongTinThuaDat(json.data);
    		});
    		$(informationDialog).dialog("open");
  		});
	}
	this.createSearchDialog = function () {
		if(hasSearchDialog){
			return;
		} else {
			hasSearchDialog = true;
		}
		var rowSoTo = createRowWithSmallInput("Số tờ:","iSoTo","text",true);
		var rowSoThua = createRowWithSmallInput("Số thửa:","iSoThua","text",true);
		$(searchDialog).html(rowSoTo);
		$(searchDialog).append(rowSoThua);

		$(searchDialog).dialog({
			title: "Tra cứu thửa đất",
			autoOpen: false,
			minWidth: 150,
    		minHeight: 150,
    		resizable: false,
    		classes: {
    			"ui-dialog-titlebar": "custom-ui-widget-header-accessible",
    		}, 
    		buttons: [{
    			text: "Tìm kiếm",
    			click: function() {
    				var soto = $("#iSoTo").val();
          			var sothua = $("#iSoThua").val();
          			if(soto == "" || sothua == "") {
			            alert("Vui lòng nhập đầy đủ thông tin!");
			            return;
          			}
          			var request_string= "http://"+host+"/thuadat/" + soto + "/" + sothua;
          			$.getJSON(request_string,function(json){
          				if(json.data === null) {
    						    alert("Không tìm thấy thửa đất này!");
    						    return;
  						    }
			            hienThiThongTinThuaDat(json.data);
			            $("#iSoTo").val('');
			            $("#iSoThua").val('');
			            $(searchDialog).dialog('close');
			            $(informationDialog).dialog("open");
                  if(searchedFeature) {
                    searchedFeature.setStyle(null);
                    selectInteraction.getFeatures().clear();
                  }
                  searchedFeature = vectorSource.getFeatureById("thuadat." + json.data.gid);
                  searchedFeature.setStyle(selectedLand);
                  map.getView().fit(searchedFeature.getGeometry(),map.getSize());
          			});
    			}
    		}],
    		close: function(){
    			hasSearchDialog = false;
    			$(this).dialog('destroy');
    		}
		});
	}
	this.CreateInformationDialog = function() {
		if(hasInformationDialog) {
			$(informationDialog).dialog('close');
		} else {
			hasInformationDialog = true;
		}
		var rowSoTo = createRowWithText("Số tờ:","shbando");
  		rowSoTo.classList.add("table-row-color");
  		var rowSoThua = createRowWithText("Số thửa:","shthua");
  		var rowDiaChi = createRowWithText("Địa chỉ:","diachi");
  		var rowLoaiDat = createRowWithText("Mục đích sử dụng:","mucdich");
  		var rowDienTich = createRowWithText("Diện tích:","dientich");
  		var a = [rowSoTo,rowSoThua,rowDiaChi,rowDienTich,rowLoaiDat];

  		$(informationDialog).html(rowSoTo);
  		for (var i = 1; i < a.length; i++){
    		if(i%2 == 0) {
      			a[i].classList.add("table-row-color");
    		}
    		$(informationDialog).append(a[i]);
  		}
  		$(informationDialog).dialog({ 
    		title: "Thông tin thửa đất",
    		autoOpen: false,
   			minWidth: 250,
    		minHeight: 250,
    		resizable: false,
   			close: function(){
   				hasInformationDialog = false;
      		$(this).dialog('destroy');
      }
  		});
	}
	var hienThiThongTinThuaDat = function (data){
  		$("#shbando").html(data.shbando);
  		$("#shthua").html(data.shthua);
        diachi = formatAddress(data.sonha,data.tenduong,data.phuong,data.thanhpho,data.tinh);
  		$("#diachi").html(diachi);
    	if(data.tenloai != null) {
     		$("#mucdich").html(data.tenloai);
  		} else {
    		$("#mucdich").html("Chưa cập nhật");
  		};
    	if(data.dtpl != null) {
      		$("#dientich").html((Math.round(data.dtpl * 100) / 100) + " m<sup>2</sup>");
    	} else {
      		$("#dientich").html("Chưa cập nhật");
    	}
	}
}

function TraCuuGiayChungNhan(){
	var searchDialog = document.createElement('div');
	var panelResult = document.createElement("div");
	var informationDialog = document.createElement('div');
	this.openDialog = function(){
		var rowCMND = createRowWithSmallInput("Số CMND/Hộ chiếu:","iCMND","text",null);

		$(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
		$(searchDialog).html(rowCMND);
		searchDialog.appendChild(document.createElement("hr"));
		searchDialog.appendChild(panelResult);

		$(searchDialog).dialog({
			title: "Tra cứu giấy chứng nhận",
		    autoOpen: false,
		    minWidth: 400,
		    maxWidth:500,
		    minHeight: 150,
		    maxHeight: 600,
		    resizable: false,
		    buttons : [{
		    	text: "Tìm kiếm",
		    	click: function() {
		    		search();
		    	}
		    }],
		    close: function(){
		    	$(this).dialog('destroy');

		    }
		});
		$(searchDialog).dialog('open');
	}
	var search = function () {
		var cmnd = $("#iCMND").val();
		if(cmnd.length == 0) {
			alert("Vui lòng nhập đầy đủ thông tin!");
			return;
		}
		var request_string= "http://"+host+"/gcn/get?cmnd=" + cmnd;
		$.getJSON(request_string,function(json){
			if(json.status == 'error') {
				alert("Lỗi tìm kiếm!");
				return;
			}
			var data = json.data;
			if(data === null || data.length == 0) {
				alert("Không tìm thấy thông tin!");
				$(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
				return;
			}
			showResult(data);
		});
	}
	var showResult = function (data) {
    $(panelResult).html('');
    $.getJSON("http://"+host+"/nguoidung/getaccesscontrol",function(json){
      var role = null;
      if(json){
        role = json.role;
      }
      for (var i = 0 ; i < data.length; i++) {
        var line2 = data[i].shgiaycn + ": ";
        if(data[i].sonha != null) line2 += data[i].sonha + "-";
        if(data[i].tenduong != null) line2 += data[i].tenduong + "-";
        if(data[i].phuong != null) line2 += "Phường " + data[i].phuong + "-";
        if(data[i].thanhpho != null) line2 += data[i].thanhpho + "-";
        if(data[i].tinh != null) line2 += data[i].tinh;
        $(panelResult).append(createRowResult(data[i].ten,line2,viewDetail,data[i],role));
      }
    });
	}
	var createRowResult = function(line1,line2,click_function,data,role) {

		var container = document.createElement('div');
		container.classList.add("row");
		container.classList.add("bg-lightblue");
		container.classList.add("p-1");
		container.classList.add("mb-1");
	  container.classList.add("rounded");

	  var l1 = document.createElement('div');
	  l1.classList.add("col-md-9");
	 	l1.classList.add("text-light");
	  l1.classList.add("font-weight-normal");
	  l1.classList.add("result-title");
	  l1.append(document.createTextNode(line1));

	  container.append(l1);
    if(role!=null){
      var btns = document.createElement('div');
      btns.classList.add("col-md-3");
      btns.classList.add("text-light");
      btns.classList.add("font-weight-light");
      btns.classList.add("font-italic");
      btns.classList.add("result-extra");
      var btnXem = document.createElement('span');
      btnXem.textContent = "Xem";
      btnXem.classList.add("col-md-1");
      btnXem.classList.add("result-btn");
      btnXem.onclick = function(){
        table = click_function(data);
        CreateInformationDialog();
        $(informationDialog).html(table);
        $(informationDialog).dialog('open');
      };
    
      btns.append(btnXem);


      container.append(btns);
    }
	  

	  var l2 = document.createElement('div');
	 	l2.classList.add("col-md-9");
	 	l2.classList.add("text-light");
	  l2.classList.add("font-weight-light");
	  l2.classList.add("font-italic");
	  l2.classList.add("result-extra");
	  l2.append(document.createTextNode(line2));

	  container.append(l2);

	  container.onmouseover = function(){
	    container.classList.remove("bg-lightblue");
	    container.classList.add("bg-smalt");
	  };
	  container.onmouseout = function(){
	    container.classList.remove("bg-smalt");
	    container.classList.add("bg-lightblue");
	  }

	  return container;
	}
	var viewDetail = function(data) {
		var table = document.createElement('table');
		table.classList.add('table');
		table.classList.add('table-bordered');
		var ThongTinChuDat = document.createElement('thead');
		var headerThongTinChuDat = document.createElement('th');
		var rowThongTinChuDat = document.createElement('tr');
		var bodyThongTinChuDat = document.createElement('tbody');

		var ThongTinGCN = document.createElement('thead');
		var headerThongTinGCN = document.createElement('th');
		var rowThongTinGCN = document.createElement('tr');
		var bodyThongTinGCN = document.createElement('tbody');

		headerThongTinChuDat.append(document.createTextNode('Thông tin người sử dụng đất'));
		headerThongTinChuDat.classList.add('color-lightblue');
		headerThongTinChuDat.scope = 'col';
		headerThongTinChuDat.colSpan = '7';
		rowThongTinChuDat.appendChild(headerThongTinChuDat);
		ThongTinChuDat.appendChild(rowThongTinChuDat);

		
		bodyThongTinChuDat.append(createRowInfo('Tên người sử dụng đất: ',data.ten));
		bodyThongTinChuDat.append(createRowInfo('Năm: ', data.nam));
		bodyThongTinChuDat.append(createRowInfo('CMND: ',data.sogiayto));
		bodyThongTinChuDat.append(createRowInfo('Ngày cấp: ', formatDate2(data.ngaycap)));
		bodyThongTinChuDat.append(createRowInfo('Địa chỉ thường trú: ', data.diachi));
		bodyThongTinChuDat.append(createRowInfo('Quốc tịch: ', data.quoctich));

		headerThongTinGCN.append(document.createTextNode('Thông tin giấy chứng nhận'));
		headerThongTinGCN.classList.add('color-lightblue');
		headerThongTinGCN.scope = 'col';
		headerThongTinGCN.colSpan = '7';
		rowThongTinGCN.appendChild(headerThongTinGCN);
		ThongTinGCN.appendChild(rowThongTinGCN);

		bodyThongTinGCN.append(createRowInfo('Số hiệu GCN: ',data.shgiaycn));
		bodyThongTinGCN.append(createRowInfo('Chỉnh lý: ',data.chinhly));
		bodyThongTinGCN.append(createRowInfo('Thửa đất số: ',data.shthua));
		bodyThongTinGCN.append(createRowInfo('Tờ bản đồ số: ',data.shbando));
		bodyThongTinGCN.append(createRowInfo('Địa chỉ: ',formatAddress(data.sonha,data.tenduong,data.phuong,data.thanhpho,data.tinh)));
		bodyThongTinGCN.append(createRowInfo('Diện tích: ',Math.round(data.dtpl * 100) / 100 + " m2"));
		bodyThongTinGCN.append(createRowInfo('Diện tích chung: ',Math.round(data.dtchung * 100) / 100 + " m2"));
		bodyThongTinGCN.append(createRowInfo('Diện tích riêng: ',Math.round(data.dtrieng * 100) / 100 + " m2"));
		bodyThongTinGCN.append(createRowInfo('Mục đích sử dụng: ',data.tenloai));
    if(data.thoihansudung) {
      bodyThongTinGCN.append(createRowInfo('Thời hạn sử dụng: ',(formatDate2(data.thoihansudung) == '31-12-9999')?'Lâu dài':formatDate2(data.thoihansudung)));
    } else {
      bodyThongTinGCN.append(createRowInfo('Thời hạn sử dụng: ',null));
    }
		
		bodyThongTinGCN.append(createRowInfo('Nguồn gốc sử dụng: ',data.nguongocsudung));
		bodyThongTinGCN.append(createRowInfo('Ngày ký: ',formatDate2(data.ngayki)));
		bodyThongTinGCN.append(createRowInfo('Cơ quan cấp: ',data.coquancap));


		table.appendChild(ThongTinChuDat);
		table.append(bodyThongTinChuDat);
		table.appendChild(ThongTinGCN);
		table.append(bodyThongTinGCN);
		return table;
	}
	var CreateInformationDialog = function() {
  		$(informationDialog).dialog({ 
    		title: "Chi tiết thông tin giấy chứng nhận",
    		autoOpen: false,
   			minWidth: 600,
    		minHeight: 550,
    		maxHeight: 750,
    		resizable: false,
   			close: function(){
      			$(this).dialog('destroy');
    		}
  		});
	}
	var createRowInfo = function(label,data) {
		var row = document.createElement('tr');
		row.classList.add('rowtracuu');
		var _label = document.createElement('td');
		_label.colSpan = '2';
		_label.style = "width:35.5%";
		_label.append(document.createTextNode(label));
		row.append(_label);
		var _data = document.createElement('th');
    _data.scope = 'row';
    _data.colSpan = '5';
    if(data) {
      _data.append(data);
    }
    row.append(_data);
		return row;
	}
}
function QuanLyChuDat() {
	var dialog = document.createElement('div');
	var tabs = document.createElement("div");
	var panelResult = document.createElement("div");
	var hasDialog = false;
	this.openDialog = function() {
		if(!hasDialog){
			createDialog();
			hasDialog = true;
		
			$(dialog).dialog({
	    		title: "Quản lý chủ sử dụng đất",
	    		autoOpen: false,
	    		minWidth: 550,
	    		minHeight: 150,
	    		maxHeight: 600,
	    		resizable: false,
	    		buttons: [{
	      			text: "Thêm chủ đất",
	      			click: function() {
	        			themchudat();
	      			}
	    		}],
	    		close: function() {
	    			hasDialog = false;
	    			dialog = document.createElement('div');
	    			tabs = document.createElement("div");
	      			$(this).dialog("destroy");
	    		}
	  		});
        var save_buttons = $(dialog).dialog("option","buttons");
	  		$(tabs).on("tabsactivate",function(event,ui){
    			if($(ui.newPanel).prop("id") == "them") {
      				if($(dialog).dialog("option","buttons").length == 0) {
        				$(dialog).dialog("option","buttons",save_buttons);
      				}
    			}
    			if($(ui.newPanel).prop("id") == "timkiem"){
      				if($(dialog).dialog("option","buttons").length > 0) {
        				$(dialog).dialog("option","buttons",[]);
      				}
    			}
    		});
    		$("#btnSearch").click(function(){
    			var cmnd = $('#iCMND_tim').val().trim();
    			if(cmnd.length == 0) {
      				$('#iCMND_tim').addClass('form-control').addClass('is-invalid');
      				return;
    			}
    			var request_string= "http://"+host+"/chudat/search?cmnd=" + cmnd;
    			$.getJSON(request_string,function(json){
      				var data = json.data;
      				if(json.data === null) {
        				$(panelResult).html(document.createTextNode("Không tìm thấy Chủ sử dụng đất này!"));
        				return;
      				}
      				$(panelResult).html(createOneRowResult(data.ten,data.diachi,function(){
        				var delete_string = "http://"+host+"/chudat/delete?machu=" + data.machu;
        				$.get(delete_string,function(json){
          					if(json.status == "success") {
            					alert("Xóa thành công");
          					} else {
            					alert("Xóa thất bại");
          					}
        				});
      				}, function(){
        				$(tabs).tabs('option','active',0);
        				$(tabs).tabs('option','disabled',[1]);
        				$("#tabs a[href='#them']").html(document.createTextNode("Sửa"));
        				var buttons = $(dialog).dialog("option","buttons");
        				buttons = [
        				{
          					text: "Cập nhật",
          					click: function(){
	            				capnhatchudat(data.machu);
	            				$("#tabs a[href='#them']").html(document.createTextNode("Thêm"));
	            				buttons.pop();
	            				$(dialog).dialog("option","buttons",buttons);
	            				$(tabs).tabs('enable',1);
	            				$('#iTen').val("");
	            				$('#iNam').val("");
	            				$('#iCMND').val("");
	            				$('#iSoGiayTo').val("");
	            				$('#iNgayCap').val("");
	            				$('#iLoai').val("");
	            				$('#iQuocTich').selectedIndex = 1;
	            				$('#iDiaChi').val("");
	            				$(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
	            				$(tabs).tabs('option','active',1);
          					}
        				},
        				{
          					text: "Hủy",
          					click: function(){
            					$("#tabs a[href='#them']").html(document.createTextNode("Thêm"));
            					buttons.pop();
            					$("#dialog").dialog("option","buttons",buttons);
            					$("#tabs").tabs('enable',1);
            					$('#iTenChu').val("");
            					$('#iNgaySinh').val("");
            					$('#iCMND').val("");
            					$('#iNgayCap').val("");
            					$('#iNoiCap').val("");
            					$('#iLoai').val("");
            					$('#iQuocTich').val("");
            					$('#iDiaChi').val("");
          					}
        				}];
        				$(dialog).dialog("option","buttons",buttons);
        				$('#iLoai').val(data.loaichu);
        				$('#iLoai').change();
        				$('#iLoai').attr('disabled','disabled');
        				$('#iTen').val(data.ten);
        				$('#iQuocTich').val(data.quoctich);
        				$('#iDiaChi').val(data.diachi);
        				if(data.loaichu == 1) {
        					$('#iNam').val(data.nam);
        					$('#iCMND').val(data.sogiayto);
        				} else if(data.loaichu == 3) {
        					$('#iSoGiayTo').val(data.sogiayto);
        					$('iNgayCap').val(formatDate(data.ngaycap));
        				}
      				}));
    			});
			});
    	}
  		$(dialog).dialog('open');
	}

	var createDialog = function() {
  		var ul = document.createElement("ul");
  		ul.innerHTML = "<li><a href='#them'><span>Thêm</span></a></li>";
  		ul.innerHTML += "<li><a href='#timkiem'><span>Tìm&nbsp;kiếm</span></a></li>";

  		$(tabs).html(ul);

  		var divThem = document.createElement("div");
  		divThem.id = "them";

  		var rowLoaiChu = document.createElement('div');
  		rowLoaiChu.classList.add("row");
  		rowLoaiChu.classList.add("form-group");
  		rowLoaiChu.classList.add("col-md-12");
  		var labelLoaiChu = document.createElement("label");
  		labelLoaiChu.classList.add("col-md-6");
      labelLoaiChu.classList.add("control-label");
  		labelLoaiChu.textContent = "Loại chủ sở hữu:";
  		var selectLoai = document.createElement('select');
  		selectLoai.classList.add('form-control');
  		selectLoai.classList.add('col-md-4');
  		selectLoai.id = "iLoai";
  		var option1 = document.createElement('option');
  		option1.textContent = "Cá nhân";
  		option1.value = "1";
  		var option2 = document.createElement('option');
  		option2.textContent = "Tôn giáo/Cộng đồng/Ngoại giao";
 	 	option2.value = "2";
 	 	var option3 = document.createElement('option');
  		option3.textContent = "Tổ chức kinh doanh";
 	 	option3.value = "3";
  		selectLoai.append(option1);
  		selectLoai.append(option2);
  		selectLoai.append(option3);
  		selectLoai.selectedIndex = -1;
  		rowLoaiChu.append(labelLoaiChu);
  		rowLoaiChu.append(selectLoai);

  		

		$(divThem).html(rowLoaiChu);
		var divChange = document.createElement('div');
		divThem.appendChild(divChange);
  		$(selectLoai).change(function(){
  			if($(selectLoai).val() == 1) {
  				var rowTenChu = createRowWithLargeInput("Họ tên: ","iTen","text");
  				var rowNamSinh = createRowWithLargeInput("Năm sinh: ","iNam","year",true);
  				var rowSoGiayTo = createRowWithLargeInput("Số chứng minh nhân dân: ","iCMND","text");
  				$(divChange).html(rowTenChu);
  				divChange.appendChild(rowNamSinh);
  				divChange.appendChild(rowSoGiayTo);
  			}
  			if($(selectLoai).val() == 3) {
  				var rowTenChu = createRowWithLargeInput("Tên tổ chức: ","iTen","text");
  				var rowSoGiayTo = createRowWithLargeInput("Số giấy phép kinh doanh: ","iSoGiayTo","text");
  				var rowNgayCap = createRowWithLargeInput("Ngày cấp: ","iNgayCap","date");
  				$(divChange).html(rowTenChu);
  				divChange.appendChild(rowSoGiayTo);
  				divChange.appendChild(rowNgayCap);
  			}
  			if($(selectLoai).val() == 2) {
  				var rowTenChu = createRowWithLargeInput("Tên tổ chức: ","iTen","text");
  				$(divChange).html(rowTenChu);
  			}
  			var rowDiaChi = createRowWithLargeInput("Địa chỉ: ","iDiaChi","text");
  			var rowQuocTich = document.createElement('div');
  			rowQuocTich.classList.add("row");
  			rowQuocTich.classList.add("form-group");
  			rowQuocTich.classList.add("col-md-12");
  			var labelQuocTich = document.createElement("label");
  			labelQuocTich.classList.add("col-md-6");
        labelQuocTich.classList.add("control-label");
  			labelQuocTich.textContent = "Quốc tịch:";
  			var selectQuocTich = createSelectBoxCountry();

  			rowQuocTich.append(labelQuocTich);
  			rowQuocTich.append(selectQuocTich);
  			divChange.appendChild(rowDiaChi);
  			divChange.appendChild(rowQuocTich);
  		});


  		tabs.appendChild(divThem);

  		var divTimKiem = document.createElement("div");
  		divTimKiem.id = "timkiem";
  		var rowTimKiem = createRowWithInputButton("Nhập CMND: ","Tìm","iCMND_tim");
  		divTimKiem.appendChild(rowTimKiem);
  		divTimKiem.appendChild(document.createElement("hr"));
  		
  		$(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
  		divTimKiem.appendChild(panelResult);

  		tabs.appendChild(divTimKiem);
  		tabs.id = 'tabs';

  		$(dialog).html(tabs);
  		$(tabs).tabs();
	}
	var themchudat = function() {
		var selectLoai = $('#iLoai').val().trim();
		var ten = $('#iTen').val().trim();
		var diachi = $('#iDiaChi').val().trim();
		var quoctich = $('#iQuocTich').val().trim();
		if(selectLoai == 1) {
  			var namsinh = $('#iNam').val().trim();
  			var cmnd = $('#iCMND').val().trim();
			var d = new Date();
    		var n = d.getFullYear();

			if(ten.length == 0 || cmnd.length == 0) {
    			if(ten.length == 0) {
      				$('#iTen').addClass('is-invalid');
    			}
    			if(cmnd.length == 0) {
      				$('#iCMND').addClass('is-invalid');
    			}
    			return;
  			}
  			if(namsinh < 1000 || namsinh > n) {
  				var text = document.createElement('div');
  				text.innerHTML = 'Năm sinh không hợp lệ!';
  				text.style.color = 'red';
  				$('#them').prepend(text);
  			}
  			data = {ten : ten, nam : namsinh, cmnd : cmnd, loai : selectLoai, quoctich: quoctich, diachi :diachi};
  			$.post("http://"+host+"/chudat/insert",data).done(function(data) {
    			if(data.status == 'success') {
      				alert("Thêm thành công!");
    			} else {
      				alert("Thêm thất bại. Vui lòng thử lại lần sau!");
    			}
  			});
		}
		if(selectLoai == 2) {
			if(ten.length == 0) {
				$('#iTen').addClass('is-invalid');
				return;
			}
			data = {ten : ten, loai : selectLoai, quoctich: quoctich, diachi :diachi};
			$.post("http://"+host+"/chudat/insert",data).done(function(data){
				if(data.status == 'success') {
					alert("Thêm thành công!");
				} else {
					alert("Thêm thất bại. Vui lòng thử lại lần sau!");
				}
			});
		}
		if(selectLoai == 3) {
			var sogiayto = $("#iSoGiayTo").val().trim();
			var ngaycap = $("#iNgayCap").val().trim();
			console.log(sogiayto);
			console.log(sogiayto);
			if(ten.length == 0 || sogiayto.length == 0) {
				if(ten.length == 0) {
					$('#iTen').addClass('is-invalid');
				}
				if(sogiayto.length == 0) {
					$("#iSoGiayTo").addClass('is-invalid');
				}
				return;
			}
			data = {ten : ten, loai : selectLoai, quoctich: quoctich, diachi :diachi, sogiayto: sogiayto, ngaycap};
			$.post("http://"+host+"/chudat/insert",data).done(function(data){
				if(data.status == 'success') {
					alert("Thêm thành công!");
				} else {
					alert("Thêm thất bại. Vui lòng thử lại lần sau!");
				}
			});
		}
	}
	var capnhatchudat = function(machu) {
		var selectLoai = $('#iLoai').val().trim();
		var ten = $('#iTen').val().trim();
		var diachi = $('#iDiaChi').val().trim();
		var quoctich = $('#iQuocTich').val().trim();
		if(selectLoai == 1) {
  			var namsinh = $('#iNam').val().trim();
  			var cmnd = $('#iCMND').val().trim();
			var d = new Date();
    		var n = d.getFullYear();

			if(ten.length == 0 || cmnd.length == 0) {
    			if(ten.length == 0) {
      				$('#iTen').addClass('is-invalid');
    			}
    			if(cmnd.length == 0) {
      				$('#iCMND').addClass('is-invalid');
    			}
    			return;
  			}
  			if(namsinh < 1000 || namsinh > n) {
  				var text = document.createElement('div');
  				text.innerHTML = 'Năm sinh không hợp lệ!';
  				text.style.color = 'red';
  				$('#them').prepend(text);
  			}
  			data = {machu: machu, ten : ten, nam : namsinh, cmnd : cmnd, loai : selectLoai, quoctich: quoctich, diachi :diachi};
  			$.post("http://"+host+"/chudat/update",data).done(function(data) {
    			if(data.status == 'success') {
      				alert("Cập nhật thành công!");
    			} else {
      				alert("Cập nhật thất bại. Vui lòng thử lại lần sau!");
    			}
  			});
		}
		if(selectLoai == 2) {
			if(ten.length == 0) {
				$('#iTen').addClass('is-invalid');
				return;
			}
			data = {machu: machu, ten : ten, loai : selectLoai, quoctich: quoctich, diachi :diachi};
			$.post("http://"+host+"/chudat/update",data).done(function(data){
				if(data.status == 'success') {
					alert("Cập nhật thành công!");
				} else {
					alert("Cập nhật thất bại. Vui lòng thử lại lần sau!");
				}
			});
		}
		if(selectLoai == 3) {
			var sogiayto = $("#iSoGiayTo").val().trim();
			var ngaycap = $("#iNgayCap").val().trim();
			if(ten.length == 0 || sogiayto.length == 0) {
				if(ten.length == 0) {
					$('#iTen').addClass('is-invalid');
				}
				if(sogiayto.length == 0) {
					$("#iSoGiayTo").addClass('is-invalid');
				}
				return;
			}
			data = {machu: machu, ten : ten, loai : selectLoai, quoctich: quoctich, diachi :diachi, sogiayto: sogiayto, ngaycap};
			$.post("http://"+host+"/chudat/update",data).done(function(data){
				if(data.status == 'success') {
					alert("Cập nhật thành công!");
				} else {
					alert("Cập nhật thất bại. Vui lòng thử lại lần sau!");
				}
			});
		}
	}
}
function QuanLyGiayChungNhan(){
	var dialog = document.createElement('div');
	var thuadatDialog = document.createElement('div');
	var chudatDialog = document.createElement('div');
	var tabs = document.createElement("div");
	var panelResult = document.createElement("div");
	var panelResult2 = document.createElement("div");
	var hasDialog = false;
	var array_thuadat = [];
	var array_chudat = [];
	this.openDialog = function() {
		if(!hasDialog){
			createDialog();
			hasDialog = true;
			$(dialog).dialog({
	    		title: "Quản lý giấy chứng nhận",
	    		autoOpen: false,
	    		minWidth: 550,
	    		minHeight: 150,
	    		maxHeight: 600,
	    		resizable: false,
	    		buttons: [{
	      			text: "Thêm giấy chứng nhận",
	      			click: function() {
	      				themgcn();
	      			}
	    		}],
	    		close: function() {
	    			hasDialog = false;
	    			dialog = document.createElement('div');
	    			tabs = document.createElement("div");
	      			$(this).dialog("destroy");
	    		}
	  	});
      var save_buttons = $(dialog).dialog("option","buttons");
	  	$("#tabs").on("tabsactivate",function(event,ui){
    		if($(ui.newPanel).prop("id") == "them") {
      		if($(dialog).dialog("option","buttons").length == 0) {
        		$(dialog).dialog("option","buttons",save_buttons);

      		}
    		}
    			if($(ui.newPanel).prop("id") == "timkiem"){
      				if($(dialog).dialog("option","buttons").length > 0) {
        				$(dialog).dialog("option","buttons",[]);
      				}	
    			}
  			});
  			$("#btnSearch").click(function(){
  				var sogiay = $('#iShgcn_tim').val().trim();
  				if(sogiay.length == 0) {
      				$('#iShgcn_tim').addClass('form-control').addClass('is-invalid');
      				return;
    			}
    			var request_string= "http://"+host+"/gcn/search?sogiay=" + sogiay;
    			$.getJSON(request_string,function(json){
    				var data = json.data;
      				if(json.data === null) {
        				$(panelResult).html(document.createTextNode("Không tìm thấy giấy chứng nhận này!"));
        				return;
      				}
      				$(panelResult).html(createOneRowResult(data.shgiaycn,data.coquancap,function(){
      					//Xoa
                var delete_string = "http://"+host+"/gcn/delete?sogiay=" + data.shgiaycn;
                $.get(delete_string,function(json){
                    if(json.status == "success") {
                      alert("Xóa thành công");
                      $(panelResult).html('');
                    } else {
                      alert("Xóa thất bại");
                    }
                });
      				},function(){
      					//Sua
      					$(tabs).tabs('option','active',0);
        				$(tabs).tabs('option','disabled',[1]);
        				$("#tabs a[href='#them']").html(document.createTextNode("Sửa"));
        				var buttons = $(dialog).dialog("option","buttons");
        				buttons = [
        				{
          					text: "Cập nhật",
          					click: function(){
          						capnhatgcn(data.shgiaycn);
	            				resetDialog(buttons);
          					}
        				},
        				{
          					text: "Hủy",
          					click: function(){
            					resetDialog(buttons);
          					}
        				}];
        				$(dialog).dialog("option","buttons",buttons);
        				array_thuadat = [];
						    array_chudat = [];
						    $('#containerThuaDat > div').each(function(){
							     $(this).remove();
						    });
						    $('#containerChuDat > div').each(function(){
							     $(this).remove();
						    });
                $('#iSoHieu').prop("disabled",true);
                $('#iSoHieu').val(data.shgiaycn);
        				$('#iNgayKy').val(formatDate(data.ngayki));
        				$('#iCoQuan').val(data.coquancap);
        				$('#iDTRieng').val(data.dtrieng);
						    $('#iDTChung').val(data.dtchung);
						    $('#iMucDich').val(data.mucdichsudung);
						    $('#iThoiHan').val(formatDate(data.thoihansudung));
						    $('#iNguonGoc').val(data.nguongocsudung);
						    array_thuadat = [];
						    array_chudat = [];
                var length_thuadat = (data.thuadat)?data.thuadat.length:0;
                var length_chudat = (data.chudat)?data.chudat.length:0;
						    for(var i = 0; i < length_thuadat; i++){
							     addThuaDat(data.thuadat[i].gid,data.thuadat[i].shbando,data.thuadat[i].shthua);
						    }
						    for(var j = 0; j < length_chudat; j++) {
							     addChuDat(data.chudat[j].machu,data.chudat[j].ten);
						    }
      				}))
    			});

  			});
		}
		$(dialog).dialog('open');
	}
	var createDialog = function() {
		tabs.id = "tabs";
		var ul = document.createElement("ul");
		ul.innerHTML = "<li><a href='#them'><span>Thêm</span></a></li>";
		ul.innerHTML += "<li><a href='#timkiem'><span>Tìm&nbsp;kiếm</span></a></li>";
		tabs.appendChild(ul);
		var divThem = document.createElement("div");
		divThem.id = "them";
    var rowSoHieu = createRowWithLargeInput("Số hiệu GCN: ","iSoHieu","text");
		var rowNgayKy = createRowWithLargeInput("Ngày ký: ","iNgayKy","date");
  	var rowCoQuan = createRowWithLargeInput("Cơ quan cấp: ","iCoQuan","text");
  	var rowDTRieng = createRowWithLargeInput("Diện tích riêng: ","iDTRieng","text");
  	var rowDTChung = createRowWithLargeInput("Diện tích chung: ","iDTChung","text");
 		var rowHSD = createRowWithLargeInput("Thời hạn sử dụng: ","iThoiHan","date");
 		var rowNguonGoc = createRowWithLargeInput("Nguồn gốc sử dụng: ","iNguonGoc","text");
 		var dataNguonGoc = ["Nhà nước giao đất không thu tiền sử dụng đất","Nhà nước giao đất có thu tiền sử dụng đất","Nhà nước cho thuê đất trả tiền một lần",
 			"Nhà nước cho thuê đất trả tiền hàng năm","Công nhận QSDĐ như giao đất có thu tiền sử dụng đất","Công nhận QSDĐ như giao đất không thu tiền sử dụng đất",
 			"Thuê đất của doanh nghiệp đầu tư hạ tầng khu công nghiệp (hoặc khu kinh tế, khu công nghệ cao)"];
 		$('#iNguonGoc').autocomplete({
 			source:dataNguonGoc,
 			minLength: 0
 		});
 		$.getJSON("/loaidat/get",function(json){
 			var data = json.data;
 			var length = data.length;
 			if(length != 0) {
 				for(var i = 0; i < length; i++){
 					var option = document.createElement('option');
 					option.textContent = data[i].tenloai;
 					option.value = data[i].maloai;
 					$("#iMucDich").append(option);
 				}
 			}
 		});
 		var rowMucDich = createRowWithSelect("Mục đích sử dụng: ", "iMucDich",[],[]);
 		//
 		var rowThuaDat = document.createElement('div');
  		rowThuaDat.classList.add("row");
  		rowThuaDat.classList.add("form-group");
  		rowThuaDat.classList.add("col-md-12");
  		var labelThuaDat = document.createElement("label");
  		labelThuaDat.classList.add("col-md-6");
  		labelThuaDat.textContent = "Thửa đất:";
  		var containerThuaDat = document.createElement('div');
  		containerThuaDat.classList.add("col-md-6");
  		containerThuaDat.classList.add("row");
  		containerThuaDat.id = "containerThuaDat";
  		var btnThemThuaDat = document.createElement('button');
  		btnThemThuaDat.classList.add("col-md-3");
  		btnThemThuaDat.classList.add("order-last");
  		btnThemThuaDat.style.fontSize = "small";
  		btnThemThuaDat.style.paddingLeft = "2px";
  		btnThemThuaDat.style.paddingRight = "2px";
  		btnThemThuaDat.type = "submit";
  		btnThemThuaDat.id = "btnThemThuaDat";
  		btnThemThuaDat.textContent = "Thêm";
  		containerThuaDat.appendChild(btnThemThuaDat);
  		rowThuaDat.append(labelThuaDat);
  		rowThuaDat.append(containerThuaDat);

  		btnThemThuaDat.onclick = function(){
  			createThuaDatDialog();
  			$(thuadatDialog).dialog('open');
  		}

  		var rowChuDat = document.createElement('div');
  		rowChuDat.classList.add("row");
  		rowChuDat.classList.add("form-group");
  		rowChuDat.classList.add("col-md-12");
  		var labelChuDat = document.createElement("label");
  		labelChuDat.classList.add("col-md-6");
  		labelChuDat.textContent = "Chủ đất:";
  		var containerChuDat = document.createElement('div');
  		containerChuDat.classList.add("col-md-6");
  		containerChuDat.classList.add("row");
  		containerChuDat.id = "containerChuDat";
  		var btnThemChuDat = document.createElement('button');
  		btnThemChuDat.classList.add("col-md-3");
  		btnThemChuDat.classList.add("order-last");
  		btnThemChuDat.style.fontSize = "small";
  		btnThemChuDat.style.paddingLeft = "2px";
  		btnThemChuDat.style.paddingRight = "2px";
  		btnThemChuDat.type = "submit";
  		btnThemChuDat.id = "btnThemChuDat";
  		btnThemChuDat.textContent = "Thêm";
  		containerChuDat.appendChild(btnThemChuDat);
  		rowChuDat.append(labelChuDat);
  		rowChuDat.append(containerChuDat);
  		btnThemChuDat.onclick = function() {
  			createChuDatDialog();
  			$(chudatDialog).dialog('open');
  		}

      divThem.appendChild(rowSoHieu);
  		divThem.appendChild(rowNgayKy);
  		divThem.appendChild(rowCoQuan);
  		divThem.appendChild(rowDTRieng);
  		divThem.appendChild(rowDTChung);
  		divThem.appendChild(rowMucDich);
  		divThem.appendChild(rowHSD);
  		divThem.appendChild(rowNguonGoc);
  		divThem.appendChild(rowThuaDat);
  		divThem.appendChild(rowChuDat);
  		tabs.appendChild(divThem);
  		var divTimKiem = document.createElement("div");
  		divTimKiem.id = "timkiem";
  		var rowTimKiem = createRowWithInputButton("Nhập số hiệu giấy chứng nhận: ","Tìm","iShgcn_tim");
  		 
  		divTimKiem.appendChild(rowTimKiem);
  		divTimKiem.appendChild(document.createElement("hr"));
  		panelResult.id = "panelResult";
  		$(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
  		divTimKiem.appendChild(panelResult);

  		tabs.appendChild(divTimKiem);
  		$(dialog).html(tabs);
  		$(tabs).tabs();
	}
	var createElements = function(txt,id,loai) {
		var element = document.createElement('div');
  		var closer = document.createElement('div');
  		var content = document.createElement('div');
  		element.classList.add('row');
  		element.classList.add('bg-secondary');

  		content.classList.add('col-md-8');
  		content.appendChild(document.createTextNode(txt));
  		content.style.paddingTop = "3px";
  		content.style.paddingLeft = "2px";
  		content.style.paddingRight = "2px";

  		closer.classList.add('col-md-2');
  		closer.classList.add('offset-md-1');
  		closer.classList.add('order-last');
  		closer.appendChild(document.createTextNode('✖'));
  		closer.style.paddingTop = "0px";
  		closer.style.paddingLeft = "5px";
  		closer.style.marginLeft = "0px";
  		closer.style.color = 'blue';
  		closer.style.cursor = "pointer";

  		element.appendChild(content);
  		element.appendChild(closer);
  		element.style.width = "fit-content";
  		element.style.color = 'white';
  		element.style.fontSize = "small";
  		element.style.paddingLeft = "2px";
  		element.style.paddingTop = "5px";
  		element.style.marginLeft = "0px";
  		element.style.marginRight = "0px";
  		element.style.marginTop = "2px";
  		element.style.borderRadius = "13px";

  		closer.onclick = function() {
  			$(element).remove();
  			if(loai == 1){
  				removeThuaDat(id);
  			} else {
  				removeChuDat(id)
  			}
  			
  		}

  		return element;
	}
	var createThuaDatDialog = function() {
		var rowSoTo = createRowWithSmallInput("Số tờ:","iSoTo","text",true);
		var rowSoThua = createRowWithSmallInput("Số thửa:","iSoThua","text",true);
		$(thuadatDialog).html(rowSoTo);
		$(thuadatDialog).append(rowSoThua);

		$(thuadatDialog).dialog({
			title: "Thửa đất",
			autoOpen: false,
			modal: true,
			minWidth: 150,
    		minHeight: 150,
    		resizable: false,
    		buttons: [{
    			text: "Thêm",
    			click: function() {
    				var soto = $("#iSoTo").val();
          			var sothua = $("#iSoThua").val();
          			if(soto == "" || sothua == "") {
			            alert("Vui lòng nhập đầy đủ thông tin!");
			            return;
          			}
          			var request_string= "http://"+host+"/gcn/isgcn?soto=" + soto + "&sothua=" + sothua;
          			$.getJSON(request_string,function(json){
          				if(json.status == 'ok'){
          					addThuaDat(json.data.gid,soto,sothua);
          					$(thuadatDialog).dialog('close');
          				} else if(json.status == 'existed') {
          					var r = confirm('Thửa đất này đã có giấy chứng nhận ' + json.data.shgiaycn + "!\nBạn có muốn tiếp tục thêm?");
          					if (r == true) {
          						addThuaDat(json.data.gid,soto,sothua);
          						$(thuadatDialog).dialog('close');
          					} else {
          						$(thuadatDialog).dialog('close');
          					}
          				} else {
          					alert("Không có thửa đất này!");
          				}
          			});
    			}
    		}],
    		close: function(){
    			console.log(array_thuadat);
    			$(this).dialog('destroy');
    		}
		});		
	}
	var removeThuaDat = function(gid) {
		for(var i = 0; i < array_thuadat.length;i++) {
			if(array_thuadat[i] == gid) {
				array_thuadat.splice(i,1);
			}
		}
	}
	var addThuaDat = function(gid,soto,sothua) {
		var i;
		for(i = 0; i < array_thuadat.length; i++) {
			if(array_thuadat[i] == gid) {
				return;
			}
		}
		array_thuadat.push(gid);
		var element = createElements(soto + '-' + sothua,gid,1);
		$('#containerThuaDat').append(element);
	}
	var addChuDat = function(machu,ten) {
		var i;
		for(i = 0; i < array_chudat.length; i++) {
			if(array_chudat[i] == machu) {
				return;
			}
		}
		array_chudat.push(machu);
		var element = createElements(ten,machu,2);
		$('#containerChuDat').append(element);
	}
	var removeChuDat = function(machu) {
		for(var i = 0; i < array_chudat.length;i++) {
			if(array_chudat[i] == machu) {
				array_chudat.splice(i,1);
			}
		}
	}
	var createChuDatDialog = function() {
		var rowTimKiem = document.createElement("div");
  	rowTimKiem.classList.add("row");
  	rowTimKiem.classList.add("form-group");

  	var label = document.createElement("label");
  	label.classList.add("col-md-3");
  	label.classList.add("control-label");
  	label.textContent = 'Tìm theo';
  	label.style.fontSize = '14px';
  	label.style.marginTop = '10px';

  	var loai = document.createElement('select');
  	loai.classList.add('form-control');
  	loai.classList.add('col-md-3');
		loai.style.marginTop = "10px";
		loai.id = 'iLoaiTimKiem';

		var option1 = document.createElement('option');
		option1.textContent = "Tên";
		option1.value = '1';
		var option2 = document.createElement('option');
		option2.textContent = "Giấy tờ";
		option2.value = '2';
		loai.appendChild(option1);
		loai.appendChild(option2);

  	var input = document.createElement("input");
  	input.classList.add("col-md-3");
  	input.type = "text";
  	input.id = 'iTimKiem';
  	input.style.marginTop = '10px';
  	input.style.height = '40px';


		var button = document.createElement("button");
  	button.classList.add("col-md-2");
  	button.classList.add("offset-md-1");
  	button.type = "submit";
  	button.id = "btnSearch";
  	button.textContent = 'Tìm';
  	button.style.marginTop = '10px';
  	button.style.height = '40px';
  	button.onclick = function() {
  		var txtSearch = $(input).val().trim();
  		if(txtSearch.length == 0) {
  			input.classList.add('is-invalid');
  		}
  		if($(loai).val() == '1'){
  			var request_string = "http://"+host+"/chudat/getbyname?ten=" + txtSearch;
  			$.getJSON(request_string,function(json){
  				if(json.status == 'success'){
  					showResult(json.data);
  				} else {
  					$(panelResult2).html(document.createTextNode("Không tìm thấy kết quả!"));
  				}
  			});
  		} else {
  			var request_string = "http://"+host+"/chudat/getbyid?id=" + txtSearch;
  			$.getJSON(request_string,function(json){
  				if(json.status == 'success'){
  					showResult(json.data);
  				} else {
  					$(panelResult2).html(document.createTextNode("Không tìm thấy kết quả!"));
  				}
  			});
  		}
  	}

  	rowTimKiem.append(label);
  	rowTimKiem.append(loai);
  	rowTimKiem.append(input);
  	rowTimKiem.append(button);

  	$(chudatDialog).html(rowTimKiem);
  	chudatDialog.appendChild(document.createElement("hr"));
  		
  	$(panelResult2).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
  	chudatDialog.appendChild(panelResult2);

  	$(chudatDialog).dialog({
  		title: "Chủ đất",
			autoOpen: false,
			modal: true,
			minWidth: 400,
    	minHeight: 150,
    	resizable: true,
    	close: function(){
    		$(this).dialog('destroy');
    	}
  	});
	}
	var showResult = function (data) {
		for (var i = 0 ; i < data.length; i++) {
			if(i == 0) {
				$(panelResult2).html(createRowResult(data[i]));
			}else {
				$(panelResult2).append(createRowResult(data[i]));
			}
		}
	}
	var createRowResult = function(data) {
		var container = document.createElement('div');
		container.classList.add("row");
		container.classList.add("bg-lightblue");
		container.classList.add("p-1");
		container.classList.add("mb-1");
	  container.classList.add("rounded");

	  var l1 = document.createElement('div');
	  l1.classList.add("col-md-9");
	 	l1.classList.add("text-light");
	  l1.classList.add("font-weight-normal");
	  l1.classList.add("result-title");
	  l1.append(document.createTextNode(data.ten));

	  container.append(l1);

	  var btns = document.createElement('div');
    btns.classList.add("col-md-3");
	  btns.classList.add("text-light");
	  btns.classList.add("font-weight-light");
	  btns.classList.add("font-italic");
	  btns.classList.add("result-extra");
	  var btnThem = document.createElement('span');
	  btnThem.textContent = "Thêm";
	  btnThem.classList.add("col-md-1");
	  btnThem.classList.add("result-btn");
	  btnThem.onclick = function(){
	  	addChuDat(data.machu,data.ten);
	  };
	  
	  btns.append(btnThem);

	  container.append(btns);

	  var l2 = document.createElement('div');
	 	l2.classList.add("col-md-9");
	 	l2.classList.add("text-light");
	  l2.classList.add("font-weight-light");
	  l2.classList.add("font-italic");
	  l2.classList.add("result-extra");
	  l2.append(document.createTextNode(data.diachi));

	  container.append(l2);

	  container.onmouseover = function(){
	    container.classList.remove("bg-lightblue");
	    container.classList.add("bg-smalt");
	  };
	  container.onmouseout = function(){
	    container.classList.remove("bg-smalt");
	    container.classList.add("bg-lightblue");
	  }

	  return container;
	}
	var themgcn = function() {
    var sohieugcn = $('#iSoHieu').val();
		var ngayky = $('#iNgayKy').val();
		var coquancap = $('#iCoQuan').val();
		var dtrieng = $('#iDTRieng').val();
		var dtchung = $('#iDTChung').val();
		var mucdich = $('#iMucDich').val();
		var thoihan = $('#iThoiHan').val();
		var nguongoc = $('#iNguonGoc').val();
		var data = {sogiaycn: sohieugcn,ngayky:ngayky,coquancap:coquancap,dtrieng:dtrieng,dtchung:dtchung,mucdich:mucdich,thoihan:thoihan,nguongoc:nguongoc,thuadat:array_thuadat,chudat:array_chudat};
		$.ajax({
			type: "POST",
			url: "http://"+host+"/gcn/insert",
			data: JSON.stringify(data),
			success: function(data){
				if(data.status == 'success') {
					alert("Thêm thành công!");
          $(dialog).dialog("close");
				} else {
					alert("Thêm thất bại. Vui lòng thử lại lần sau!");
				}
			},
			contentType: "application/json"
		});
	}
	var capnhatgcn = function(shgcn) {
		var ngayky = $('#iNgayKy').val();
		var coquancap = $('#iCoQuan').val();
		var dtrieng = $('#iDTRieng').val();
		var dtchung = $('#iDTChung').val();
		var mucdich = $('#iMucDich').val();
		var thoihan = $('#iThoiHan').val();
		var nguongoc = $('#iNguonGoc').val();
		var data = {shgiaycn: shgcn, ngayky:ngayky,coquancap:coquancap,dtrieng:dtrieng,dtchung:dtchung,mucdich:mucdich,thoihan:thoihan,nguongoc:nguongoc,thuadat:array_thuadat,chudat:array_chudat};
		$.ajax({
			type: "POST",
			url: "http://"+host+"/gcn/update",
			data: JSON.stringify(data),
			success: function(data){
				if(data.status == 'success') {
					alert("Cập nhật thành công!");
				} else {
					alert("Cập nhật thất bại. Vui lòng thử lại lần sau!");
				}
			},
			contentType: "application/json"
		});
	}
	var resetDialog = function(buttons){
		$("#tabs a[href='#them']").html(document.createTextNode("Thêm"));
    $(dialog).dialog("option","buttons",buttons);
    $(tabs).tabs('enable',1);
    $(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
    $(tabs).tabs('option','active',1);
    $('#iSoHieu').prop("disabled",false);
    $('#iSoHieu').val('');
    $('#iNgayKy').val('');
		$('#iCoQuan').val('');
		$('#iDTRieng').val('');
		$('#iDTChung').val('');
		$('#iMucDich').selectedIndex = 6;
		$('#iThoiHan').val('');
		$('#iNguonGoc').val('');
		$('#iShgcn_tim').val('');
		$('#containerThuaDat > div').each(function(){
			$(this).remove();
		});
		$('#containerChuDat > div').each(function(){
			$(this).remove();
		});
		array_thuadat = [];
		array_chudat = [];
	}
}
function QuanLyVanBanNhaNuoc() {
  var dialog = document.createElement('div');
  var searchDialog = document.createElement('div');
  var tabs = document.createElement("div");
  var panelResult = document.createElement("div");
  var hasDialog = false;
  var hasSearchDialog = false;
  this.openDialog = function() {
    if(!hasDialog) {
      createDialog();
      hasDialog = true;
      $(dialog).dialog({
        title: "Quản lý văn bản nhà nước",
        autoOpen: false,
        minHeight: 150,
        minWidth: 450,
        resizable: false,
        buttons: [{
          text: "Thêm văn bản",
          click: function(){
            var sohieu = $("#iSoHieu").val().trim();
            var noidung = $("#iNoiDung").val().trim();
            var link = $("#iLink").val().trim();
            if(sohieu.length == 0 || link.length == 0) {
              if(sohieu.length == 0) {
                $("#iSoHieu").addClass("is-invalid");
              }
              if(link.length == 0) {
                $("#iLink").addClass("is-invalid");
              }
              return;
            }
            var insert_string = "http://"+host+"/vanban/insert";
            var data = {sohieu: sohieu,noidung: noidung,link: link};
            $.post(insert_string,data).done(function(json){
              if(json.status == "success"){
                alert("Thêm văn bản thành công!");
                $(dialog).dialog('close');
              } else {
                alert("Thêm thất bại! Vui lòng thử lại sau.");
              }
            })
          }
        }],
        close: function() {
          hasDialog = false;
          $(this).dialog("destroy");
        }
      });
    }
    $(dialog).dialog('open');
  }
  this.openSearchDialog = function(){
    if(!hasSearchDialog) {
      createSearchDialog();
      hasSearchDialog = true;
      $(searchDialog).dialog({
        title: "Tra cứu văn bản nhà nước",
        autoOpen: false,
        minWidth: 450,
        minHeight: 150,
        resizable: false,
        close: function(){
          $(this).dialog("destroy");
          hasSearchDialog = false;
        }
      });
    }
    $(searchDialog).dialog("open");
  }
  var createDialog = function() {
    var ul = document.createElement("ul");
    ul.innerHTML = "<li><a href='#them'><span>Thêm</span></a></li>";

    $(tabs).html(ul);

    var divThem = document.createElement("div");
    divThem.id = "them";

    var rowSohieu = createRowWithLargeInput("Số hiệu văn bản: ","iSoHieu","text",null);
    var rowNoiDung = createRowWithLargeInput("Nội dung: ","iNoiDung","text", null);
    var rowLink = createRowWithLargeInput("Link: ","iLink","text", null);

    $(divThem).html(rowSohieu);
    divThem.appendChild(rowNoiDung);
    divThem.appendChild(rowLink);
    tabs.appendChild(divThem);

    tabs.id = 'tabs';

    $(dialog).html(tabs);
    $(tabs).tabs();    
  }
  var createSearchDialog = function() {
    var rowTracuu = document.createElement("div");
    rowTracuu.classList.add("row");
    rowTracuu.classList.add("form-group");

    var vanban = document.createElement('select');
    vanban.classList.add('form-control');
    vanban.classList.add('col-md-9');
    vanban.style.marginTop = "10px";
    vanban.style.fontSize = "15px";
    vanban.id = 'iVanBan';

    var button = document.createElement("button");
    button.classList.add("col-md-2");
    button.classList.add("ui-button");
    button.classList.add("ui-corner-all ui-widget");
    button.type = "submit";
    button.id = "btnView";
    button.textContent = 'Xem';
    button.style.marginTop = '10px';
    button.style.height = '40px';
    button.style.marginLeft = '20px';
    button.style.fontSize = "15px";
    button.onclick = function() {
      var selected = $(vanban).val().trim();
      window.open(selected,"_blank");
    }

    rowTracuu.append(vanban);
    rowTracuu.append(button);

    $(searchDialog).html(rowTracuu);
    $.getJSON("http://"+host+"/vanban/getlist",function(json){
      if(json.status == "success" && json.data.length > 0) {
        for(var i=0; i < json.data.length; i++){
          var option = document.createElement('option');
          option.value = json.data[i].link;
          option.classList.add("option-text");
          option.textContent = json.data[i].sohieu + "   " + json.data[i].noidung;
          $("#iVanBan").append(option);
        }
      }
    });
  }
}
function ThongTin() {
  var dialog = document.createElement('div');
  var hasDialog = false;
  this.openDialog = function() {
    if(!hasDialog) {
      createDialog();
      hasDialog = true;
      $(dialog).dialog({
        title: "Thông tin",
        autoOpen: false,
        minHeight: 500,
        minWidth: 600,
        close: function() {
          $(this).dialog('destroy');
          hasDialog = false;
        }
      });
    }
    $(dialog).dialog('open');
  }
  var createDialog = function() {
    var headerTxt = 'Đề tài: "Xây dựng hệ thống WebGIS hỗ trợ tra cứu thông tin đất đai tại phường 1, thành phố Đà Lạt, tỉnh Lâm Đồng"';
    var header = document.createElement('h4');
    header.align = "center";
    header.classList.add("thongtin-header");

    var thongtinlv = document.createElement('div');
    thongtinlv.style.marginTop = "10px";
    thongtinlv.align = "center";
    thongtinlv.appendChild(document.createTextNode("Thời gian thực hiện: 2018"));
    thongtinlv.appendChild(document.createElement("br"));
    thongtinlv.appendChild(document.createTextNode("Giảng viên hướng dẫn: PGS.TS.Trần Trọng Đức"));

    var table = document.createElement('table');
    table.classList.add('thongtin-table');
    table.cellSpacing = "0";
    var table_html = '<tr><th rowspan="6"><img src="/images/hoa.jpg" height=200 width=130 border=3></img></th><td height=10>Sinh viên thực hiện: Nguyễn Hữu Đông Hòa</td></tr>' +
                      '<tr><td height=10>MSSV: 1411361</td></tr>' + 
                      '<tr><td height=10>Ngành: Trắc địa - Bản đồ</td></tr>' + 
                      '<tr><td height=10>Bộ môn: Địa Tin Học</td></tr>' + 
                      '<tr><td height=10>Trường: Đại học Bách Khoa - Đại học Quốc gia TP.HCM</td></tr>';
    table.innerHTML = table_html;
    $(header).html(document.createTextNode(headerTxt));
    $(header).append(thongtinlv);
    $(header).append(table);

    dialog.style.backgroundColor = "#99c1d6"
    $(dialog).html(header);
  }
}
function QuanLyNguoiDung() {
  var dialog = document.createElement('div');
  var tabs = document.createElement('div');
  var panelResult = document.createElement('div');
  hasDialog = false;
  this.openDialog = function(){
    if(!hasDialog) {
      createDialog();
      hasDialog = true;
      $(dialog).dialog({
        title: 'Quản lý người dùng',
        autoOpen: false,
        minHeight: 150,
        maxHeight: 600,
        minWidth: 450,
        buttons: [{
          text: 'Thêm người dùng',
          click: function(){
            themnguoidung();
          }
        }],
        close: function() {
          hasDialog = false;
          $(this).dialog('destroy');
        }
      });
      var save_buttons = $(dialog).dialog("option","buttons");
      $(tabs).on('tabsactivate',function(event,ui){
        if($(ui.newPanel).prop("id") == "them") {
          if($(dialog).dialog("option","buttons").length == 0) {
            $(dialog).dialog("option","buttons",save_buttons);
          }
        }
        if($(ui.newPanel).prop("id") == "danhsach") {
          if($(dialog).dialog("option","buttons").length > 0) {
            $(dialog).dialog("option","buttons",[]);
          }
          var request_string = "http://"+host+"/nguoidung/getlist";
          $.getJSON(request_string,function(json){
            if(json.status == 'success'){
              $(panelResult).html('');
              for(var i =0; i< json.data.length;i++){
                $(panelResult).append(createRowResult(json.data[i]));
              }
            } else {
              $(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
            }
          });
        }
      });
      $("#btnSearch").click(function(e){
        var loai = $("#iLoaiTimKiem").val();
        var txtSearch = $("#iTimKiem").val().trim();
        var request_string = "http://"+host+"/nguoidung/get?loai=" + loai + "&content=" + txtSearch;
        $.getJSON(request_string,function(json){
          if(json.status == 'success'){
            $(panelResult).html('');
            for(var i =0; i< json.data.length;i++){
                $(panelResult).append(createRowResult(json.data[i]));
            }
          } else {
            $(panelResult).html(document.createTextNode("Không tìm thấy người dùng này!"));
          }
        });
      });  
    }
    $(dialog).dialog('open');
  }
  var createDialog = function(){
    var ul = document.createElement("ul");
    ul.innerHTML = "<li><a href='#them'><span>Thêm</span></a></li>";
    ul.innerHTML += "<li><a href='#danhsach'><span>Danh sách</span></a></li>";

    $(tabs).html(ul);

    var divThem = document.createElement("div");
    divThem.id = "them";

    var rowUser = createRowWithLargeInput("Tên tài khoản: ","iUser","text",null);
    var rowPass = createRowWithLargeInput("Họ tên: ", "iHoTen","text",null);
    var rowCMND = createRowWithLargeInput("CMND: ","iCMND","text",true);
    var rowDiaChi = createRowWithLargeInput("Địa chỉ","iDiaChi","text",null);
    var rowChucVu = createRowWithSelect("Chức vụ","iChucVu",["Quản trị viên","Cán bộ"],[1,2]);

    $(divThem).html(rowUser);
    divThem.appendChild(rowPass);
    divThem.appendChild(rowCMND);
    divThem.appendChild(rowDiaChi);
    divThem.appendChild(rowChucVu);
    tabs.appendChild(divThem);

    var divDS = document.createElement("div");
    divDS.id = "danhsach";

    var rowTimKiem = document.createElement("div");
    rowTimKiem.classList.add("row");
    rowTimKiem.classList.add("form-group");

    var label = document.createElement("label");
    label.classList.add("col-md-3");
    label.classList.add("control-label");
    label.textContent = 'Tìm theo';
    label.style.fontSize = '14px';
    label.style.marginTop = '10px';

    var loai = document.createElement('select');
    loai.classList.add('form-control');
    loai.classList.add('col-md-3');
    loai.classList.add('option-text');
    loai.style.marginTop = "10px";
    loai.id = 'iLoaiTimKiem';

    var option1 = document.createElement('option');
    option1.textContent = "Tên tài khoản";
    option1.value = '1';
    var option2 = document.createElement('option');
    option2.textContent = "Họ tên người dùng";
    option2.value = '2';
    loai.appendChild(option1);
    loai.appendChild(option2);

    var input = document.createElement("input");
    input.classList.add("col-md-3");
    input.classList.add("form-control");
    input.type = "text";
    input.id = 'iTimKiem';
    input.style.marginTop = '10px';
    input.style.marginLeft = '5px';
    input.style.marginRight = '5px';
    input.style.height = '40px';


    var button = document.createElement("button");
    button.classList.add("col-md-2");
    button.classList.add("ui-button");
    button.classList.add("ui-corner-all ui-widget");
    button.type = "submit";
    button.id = "btnSearch";
    button.textContent = 'Tìm';
    button.style.marginTop = '10px';
    button.style.height = '40px';

    rowTimKiem.append(label);
    rowTimKiem.append(loai);
    rowTimKiem.append(input);
    rowTimKiem.append(button);

    $(divDS).html(rowTimKiem);
    divDS.appendChild(document.createElement("hr"));
      
    $(panelResult).html(document.createTextNode("Chưa có kết quả tìm kiếm!"));
    divDS.appendChild(panelResult);


    tabs.appendChild(divDS);
    tabs.id = 'tabs';

    $(dialog).html(tabs);
    $(tabs).tabs();    
  }
  var themnguoidung = function(){
    var user = $("#iUser").val().trim();
    var hoten = $("#iHoTen").val().trim();
    var cmnd = $("#iCMND").val().trim();
    var diachi = $("#iDiaChi").val().trim();
    var chucvu = $("#iChucVu").val().trim();

    if(user.length ==0) {
      $("#iUser").addClass("is-invalid");
      return;
    }
    var data = {user:user,hoten:hoten,cmnd:cmnd,diachi:diachi,chucvu:chucvu};
    var insert_string = "http://"+host+"/nguoidung/insert";
    $.post(insert_string,data).done(function(data){
      if(data.status == "success"){
        alert("Thêm người dùng thành công");
        $(dialog).dialog("close");
      } else {
        alert("Thất bại! Vui lòng thử lại sau");
      }
    });
  }
  var createRowResult = function(data) {
    var container = document.createElement('div');
    container.classList.add("row");
    container.classList.add("bg-lightblue");
    container.classList.add("p-1");
    container.classList.add("mb-1");
    container.classList.add("rounded");

    var l1 = document.createElement('div');
    l1.classList.add("col-md-9");
    l1.classList.add("text-light");
    l1.classList.add("font-weight-normal");
    l1.classList.add("result-title");
    l1.append(document.createTextNode(data.username));

    container.append(l1);

    var btns = document.createElement('div');
    btns.classList.add("col-md-3");
    btns.classList.add("text-light");
    btns.classList.add("font-weight-light");
    btns.classList.add("font-italic");
    btns.classList.add("result-extra");
    var btnSua = document.createElement('span');
    btnSua.textContent = "Sửa";
    btnSua.classList.add("col-md-1");
    btnSua.classList.add("result-btn");
    btnSua.onclick = function(){
      $(tabs).tabs('option','active',0);
      $(tabs).tabs('option','disabled',[1]);
      $("#tabs a[href='#them']").html(document.createTextNode("Sửa"));
      $("#iUser").prop("disabled",true);
      $("#iUser").val(data.username);
      $("#iHoTen").val(data.hoten);
      $("#iCMND").val(data.cmnd);
      $("#iDiaChi").val(data.diachi);
      $("#iChucVu").val(data.chucvu);
      var save_buttons = $(dialog).dialog("option","buttons");
      var buttons = [{
        text: "Cập nhật",
        click: function(){
          var hoten = $("#iHoTen").val().trim();
          var cmnd = $("#iCMND").val().trim();
          var diachi = $("#iDiaChi").val().trim();
          var chucvu = $("#iChucVu").val().trim();
          var id = data.id;
          capnhatnguoidung(id,hoten,cmnd,diachi,chucvu);
          resetDialog(save_buttons);
        }
      },{
        text: "Hủy",
        click: function(){
          resetDialog(save_buttons);
        }
      }];
      $(dialog).dialog("option","buttons",buttons);

    };
    
    btns.append(btnSua);

    container.append(btns);

    var l2 = document.createElement('div');
    l2.classList.add("col-md-9");
    l2.classList.add("text-light");
    l2.classList.add("font-weight-light");
    l2.classList.add("font-italic");
    l2.classList.add("result-extra");
    l2.append(document.createTextNode(data.hoten));

    container.append(l2);

    container.onmouseover = function(){
      container.classList.remove("bg-lightblue");
      container.classList.add("bg-smalt");
    };
    container.onmouseout = function(){
      container.classList.remove("bg-smalt");
      container.classList.add("bg-lightblue");
    }

    return container;
  }
  var capnhatnguoidung = function(id,hoten,cmnd,diachi,chucvu){
    var data = {id:id,hoten:hoten,cmnd:cmnd,diachi:diachi,chucvu:chucvu};
    var update_string = "http://"+host+"/nguoidung/update";
    $.post(update_string,data).done(function(data){
      if(data.status == "success"){
        alert("Cập nhật người dùng thành công");
        $(dialog).dialog("close");
      } else {
        alert("Thất bại! Vui lòng thử lại sau")
      }
    });
  }
  var resetDialog = function(buttons){
    $("#iUser").val('');
    $("#iHoTen").val('');
    $("#iCMND").val('');
    $("#iDiaChi").val('');
    $("#iChucVu").prop("selectedIndex",0);
    $("#iTimKiem").val('');
    $("#tabs a[href='#them']").html(document.createTextNode("Thêm"));
    $(tabs).tabs('enable',1);
    $(tabs).tabs('option','active',1);
    $(dialog).dialog("option","buttons",buttons);
  }
}