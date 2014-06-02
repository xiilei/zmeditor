var _dom = $('#dcanvas');
var offset = _dom.offset();
var draw =_dom[0].getContext('2d');
var alive = false;
var points = [];
var resultdom = $('#result');

draw.lineWidth = 1.0;
_dom.bind('mousedown',function(e){
    var X= e.clientX-offset.left;
    var Y= e.clientY-offset.top;
    alive = true;
    clear();
    draw.lineWidth = 1.0;                
    draw.strokeStyle = "#000000"; 
    draw.beginPath();
    draw.moveTo(X, Y);
    points = [];
    points.push({X:X,Y:Y});
}).bind('mousemove',function(e){
    var X= e.clientX-offset.left;
    var Y= e.clientY-offset.top;
    draw.lineTo(X,Y);
    if(alive){
        draw.stroke();
    }
    points.push({X:X,Y:Y});
    
}).bind('mouseup',function(){
   // draw.stroke();
   alive = false;
   if(points.length>400){
      resultdom.css('color','red').html('傻逼');
      return false;
   }
   if(points.length>2){               
      var result = guess();
      resultdom.css('color','green').html(result.r == 2 ? '弧线' :'直线');
      switch(result.r){
           case 1 :clear(); drawLine(result.pt[0],result.pt[1]);break;
           case 2:
            //var _rd = rd(result.pt[0],result.pt[1],result.pt[2]);
            //console.log(_rd);
            //drawArc(_rd.c,_rd.r,_rd.start,_rd.end);
            //clear();
            drawQuadraticCurveTo(result.pt[1],result.pt[0],result.pt[2]);
            break;
      }
   }else{
      resultdom.css('color','red').html('unknow');   
   }
});

function d(x1,x2){
    return Math.sqrt(Math.pow(x2.Y-x1.Y,2) + Math.pow(x2.X - x1.X,2));
}

//面积算法1
function s1(d1,d2,d3){
   var p = (d1+d2+d3)/2;
   return Math.sqrt(p*(p-d1)*(p-d2)*(p-d3));
}

//面积算法2
function s2(a,b,c){
   return Math.abs((a.X-c.X)*(b.Y-c.Y)-(a.Y-c.Y)*(b.X-c.X))/2;
}

function vd(x,a,b){
   var d3 = d(a,b);
   return s2(x,a,b)*2/d3;
}        

function rd(m,a,b){
   var _d3 = d(a,b);
   var _s = s2(a,b,m);
   var _xc = s2({X:a.X*a.X+a.Y*a.Y,Y:a.Y},{X:b.X*b.X+b.Y*b.Y,Y:b.Y},{X:m.X*m.X+m.Y*m.Y,Y:m.Y})/(2*_s);
   var _yc = s2({X:a.X,Y:a.X*a.X+a.Y*a.Y},{X:b.X,Y:b.X*b.X+b.Y*b.Y},{X:m.X,Y:m.X*m.X+m.Y*m.Y})/(2*_s);
   var _r = Math.sqrt((m.X-_xc)*(m.X-_xc)+(m.Y-_yc)*(m.Y-_yc));
   //var ang = Math.acos((_r*_r+_r*_r-_d3*_d3)/(2*_r*_r));
   //var starta = Math.atan2(b.X,b.Y);
   return {c:{X:_xc,Y:_yc},r:_r,start:0,end:360/Math.PI};
}

function guess(){
    var start = points.shift();
    var end = points.pop();
    var base = d(start,end)*.2,i=0,result = {r:1,pt:[start,end]},_rd=0;
    for(;i<points.length;i++){
        //console.log(vd(points[i],start,end),base);
        _rd = vd(points[i],start,end);
        if(_rd>base){
            base = _rd;
            result = {r:2,pt:[points[i],start,end]};                        
        }
    }               
    return result;
}

function clear(){
    draw.clearRect(0,0,400,300); 
}

function drawLine(x1,x2){
    draw.lineWidth = 2.0;
    draw.strokeStyle = "green"; 
    draw.beginPath();
    draw.moveTo(x1.X, x1.Y);
    draw.lineTo(x2.X,x2.Y);
    draw.stroke();
}

function drawArc(c,r,angle1,angle2,dir){
    dir = dir || false;
    draw.lineWidth = 2.0;
    draw.strokeStyle = "green"; 
    draw.beginPath();
    draw.arc(c.X,c.Y,r,angle1,angle2,dir);
    draw.stroke();
}

function drawQuadraticCurveTo(a,b,c){
    draw.lineWidth = 2.0;
    draw.strokeStyle = "green"; 
    draw.beginPath();
    draw.moveTo(a.X, a.Y);
    draw.quadraticCurveTo(b.X,b.Y,c.X,c.Y);
    draw.stroke();
}
