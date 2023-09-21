function upTime(){
	let Today = [0,0,0,0];
	let First = dateCraser("20/09/2023");
	Today[0] = new Date;
	Today[1] = Today[0].getDate();
	Today[2] = Today[0].getMonth();
	Today[3] = Today[0].getFullYear();
	let v = dateCombineter(Today,First);
	document.querySelector("#time").innerHTML =`${v}days ${Today[0].getHours()<10?'0'+Today[0].getHours():Today[0].getHours()}:${Today[0].getMinutes()<10?'0'+Today[0].getMinutes():Today[0].getMinutes()}:${Today[0].getSeconds()<10?'0'+Today[0].getSeconds():Today[0].getSeconds()}`;
}
function dateCraser(date){
	let First = [0,0,0,0];
	First[0] = date;
	First[1] = First[0][0]+First[0][1];
	First[2] = First[0][3]+First[0][4];
	First[3] = First[0][6]+First[0][7]+First[0][8]+First[0][9];
	return First;
}
function dateCombineter(Today,First){
	let diffMonth=0,diffDate=0;
	let diffYear = (Today[3] - First[3])*365;
	if(diffYear > 0){
		diffMonth = ((12-First[2])+Today[2])*30;
	}else{
		diffMonth = (Today[2]-First[2])*30;
	}
	diffDate = ((30-First[1])+Today[1])*1;
	let v = (diffYear+diffMonth+diffDate);
	return v;
}
setInterval(()=>{
  upTime();
},1000);
deviceCheck(navigator.userAgent);
function deviceCheck(details){
	let regexp = /android|iphone|kindle|ipad/i;
	let isMobileDevice = regexp.test(details);
	if(isMobileDevice){ 
    document.getElementById("device").innerHTML = `&#10003; (Mobile Vision)`; 
  }else{ 
    document.getElementById("device").innerHTML = `&#10003; (Desktop Vision)`; 
  }
}
function moreFeature(){
	document.querySelector(".moreBack").style.display="block";
	para1load();
}
function moreClose(){
	document.querySelector(".moreBack").style.display="none";
}
function para1load(){
	document.getElementById("moreP1").style.display="block";
	document.getElementById("para1").style.background="#e6e6e6";
	document.getElementById("moreP2").style.display="none";
	document.getElementById("para2").style.background="#f6f6f6";
}
function para2load(){
	document.getElementById("moreP2").style.display="block";
	document.getElementById("para2").style.background="#e6e6e6";
	document.getElementById("moreP1").style.display="none";
	document.getElementById("para1").style.background="#f6f6f6";
}