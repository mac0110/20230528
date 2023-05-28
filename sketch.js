let points = [[1,3],[3,4], [8,5],[9,7],[9,15],[10,19],[11,22],[13,23],[15,24],[13,22],[13,19],[15,15],[16,12],[17,7],[18,5],[22,4],[25,3],[22,2],[17,1],[9,1],[3,2],[1,3],[8,5],[11,4],[15,4],[18,5],[17,7],[15,6],[11,6],[9,7],[8,5]]; 

var stroke_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)
var fill_colors = "5dfdcb-90d7ff-c9f9ff-bfd0e0-b8b3be".split("-").map(a=>"#"+a)



//粒子，類別
class Obj{ //一帽子物件的設定
  constructor(args){//預設值，基本資料(包含有物件的顏色，位置，速度，大小...)
    // this.p =args.p|| {x:random(width),y:random(height)}//一個物件開始的位置
    this.p =args.p|| createVector(random(width),random(height))
    // this.v = {x:random(-1,1),y:random(-1,1)} //速度，x y 移動的速度危亂數產生-1,1之間的數字
    this.v = createVector(random(-1,1),random(-1,1)) //產生一個X座標值為random(-1,1)，Y座標值為random(-1,1)
    this.size = random(5,10) //放大倍率
    this.color = random(fill_colors) //充滿顏色
    this.stroke = random(stroke_colors) //線條顏色
  }
  draw()//把物件畫出來的函數
  {
  push() //重新設定，設定新的圓臉與顏色設定
    translate(this.p.x,this.p.y) //原點設定在==>物件所在位置
    scale((this.v.x<0?1:-1),-1) //放大縮小的指令，左右翻轉==>this.v.x<0?1:-1),-1 ==>this.v.x<0條件成立的話，則值為1，否則為-1
    fill(this.color)
    stroke(this.stroke)
    strokeWeight(3)
    beginShape()
      for(var i=0;i<points.length-1;i=i+1){
       //line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
       vertex(points[i][0]*this.size,points[i][1]*this.size)
       //curveVertex(points[i][0]*this.size,points[i][1]*this.size)
      }
      endShape()
    pop()
  }
  update(){ //移動後設定位置資料值為何
    //移動的程式碼+++++++++++++++++++++++++++++
    // this.p.x = this.p.x+this.v.x
    // this.p.y = this.p.y+this.v.y
        this.p.add(this.v) //此行的效果跟上面兩行一樣,add為加
   //++++++++++++++++++++++++++++++++++++++++++
//算出滑鼠位置的向量
    let mouseV = createVector(mouseX,mouseY) //把目前滑鼠的位置轉成向量值
    // let delta = mouseV.sub(this.p).limit(3)  //dalta值紀錄與滑鼠方向移動的單位距離，sub為向量減法，limit為每次移動的單位
    let delta = mouseV.sub(this.p).limit(this.v.mag()*2)//與原本物件的速度有關，this.v.mag()==>fm32k6
    this.p.add(delta)
    //碰壁的處理程式碼++++++++++++++++++++++++++
    if(this.p.x<=0 || this.p.x>=width) //<0碰到左邊，>width為碰到右邊
    {
      this.v.x = -this.v.x
    }
    if(this.p.x<=0 || this.p.x>=width) //<0碰到左邊，>width為碰到右邊
    if(this.p.y<=0|| this.p.y>=height)
    {
      this.v.y = -this.v.y
    }
    //++++++++++++++++++++++++++++++++++++++++++++
  }
  isBallInRanger(x,y){ //判斷有沒有被滑鼠按到
    let d = dist(x,y,this.p.x,this.p.y) //計算滑鼠按下的點與此物件位置之間的距離
    if(d<this.size*4){ //4的由來:去看作標點最大的值，以此作為方框的高與寬
      return true //代表距離有在範圍內
    }else{
      return false//代表距離沒有在範圍內
    }
  }
}
var ball //代表單一個物件，利用這個變數來做正在處理的物件
var balls =[] //陳列，放所有的物件資料，倉庫，裡面儲存所有的物件資料
var bullet 
var bullets =[]
var score = 0

function setup() { //設定海豚物件倉庫內的資料
  createCanvas(windowWidth, windowHeight);
  //產生幾個物件
  for(var j=0;j<100;j=j+1)
  {
    ball = new Obj({})//產生一個新的物件，暫時放入到ball變數中
    balls.push(ball) //把ball物件放入balls物件倉庫(陳列)中

  }
}
function draw() { //每秒會執行60次
  background(220);
  //for(var k=0;k<balls.length;k=k+1){
  //  ball = balls[k]
  //  ball.draw()
  //  ball.update()
  // }

  for(let ball of balls){ //針對陳列變數，取出陳列內一個一個的物件
   ball.draw()
   ball.update()
   //由此判斷，每隻海豚有沒有接觸每一個飛彈
   for(let bullet of bullets){
    if(ball.isBallInRanger(bullet.p.x,bullet.p.y))//判斷ball與bullet有沒有碰撞
    {
      score = score +1
      balls.splice(balls.indexOf(ball),1)
      bullets.splice(bullets.indexOf(bullet),1)
            
    }
   }
  }

  for (let bullet of bullets){ //針對陳列變數，取出陳列內一個一個的物件
    bullet.draw()
    bullet.update()
   }
  textSize(50)
  text(score,50,50)
  //+++++畫出中間的砲台+++++
  push()
  let dx = mouseX-width/2
  let dy = mouseY-height/2
  let angle = atan2(dy,dx)

  translate(width/2,height/2)
  rotate(angle)//讓三角形翻轉
  noStroke()
  fill("#ffc03a")
  ellipse(0,0,60)
  fill("#ff000")
  triangle(50,0,0-25,-25,-25,25)
pop()
//+++++++++++++++++++++++++++++++++++++++++
}

function mousePressed(){
  //++++++++++++++++++++++++++++++++++++++++++++++++++
  //按下滑鼠產生一個物件程式碼
  // ball = new Obj({
  //   p:{x:mouseX,y:mouseY}
  // }) //產生一個新的物件，暫時放入到ball變數中
  // balls.push(ball) //把ball物件放入balls物件倉庫(陳列)中
  //+++++++++++++++++++++++++++++++++++++++++++++++++++

  //按下滑鼠刪除海豚物件
//   for(let ball of balls){
//     if(ball.isBallInRanger(mouseX,mouseY)){
//       //把倉庫的這個物件刪掉
//       score = score+1
//       balls.splice(balls.indexOf(ball),1) //把倉庫內第幾個刪除，只刪除一個(indexOf()找出ball的編號)
      
//     }
//   }

//新增一筆飛彈資料(還沒有顯示)
  bullet = new Bullet({
    r:random(10,30)
  })
  
  bullets.push(bullet)//把這一筆資料放入飛彈倉庫
}
