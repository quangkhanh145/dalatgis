const host = location.host;
const dmapfile = "e:/temp/gisdemo2/dbms.map";
const portMap = "8081";
const _premapserv = "http://" + location.hostname + ":"+portMap+"/cgi-bin/mapserv.exe?map=" + dmapfile + "&";
const _thuadat = _premapserv + "service=wfs&version=1.0.0&request=getfeature&typename=thuadat";