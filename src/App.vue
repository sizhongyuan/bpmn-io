<template>
  <div id="app">
    <div class="content" id="js-drop-zone">
      <div class="canvas" id="js-canvas"></div>
      <div class="properties-panel-parent" id="js-properties-panel"></div>
    </div>

    <ul class="buttons">
      <li>
        <input type="file" value="打开Bpmn" id="uploadFile">
      </li>
      <li v-for=" i in buttonList">
        <a :id="i.id"  href="javascript:void(0)"  class="myButton" :title="i.name">
          {{i.name}}
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
//import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  data(){
    return{
      buttonList:[{name:"打开BPMN",id:"openBpmn"},{name:"保存BPMN",id:"saveBpmn"},{name:"保存图片",id:"saveSvg"},{name:"下载BPMN",id:"downloadBpmn"}],
    }
  }
}
</script>

<style lang="less">
  html{
    height:100%;
  }
  body{
    height:100%;
  }
  #app{
    height:100%;
  }

  /*#js-download-diagram,#js-download-svg{*/
    /*display:none;*/
  /*}*/
  a[href="http://bpmn.io"]{
    display:none
  }
  #uploadFile{
    position: absolute;
    visibility: hidden;
  }
  .reset{

  }
  .reset::before{
    content: '\f41f';
  }











  .bpmn-icon-intermediate-event-none,.bpmn-icon-subprocess-expanded,.bpmn-icon-data-object,.bpmn-icon-data-store,.bpmn-icon-participant,.bpmn-icon-screw-wrench{
    display:none!important;
  }
  .comeAndGoBkg{
    position:fixed;
    left:0;right:0;
    top:0;bottom:0;
    z-index:999998;
    display:none;
  }
  .comeAndGo{
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    box-shadow:0 0 8px rgba(85,85,85,.5);
    width:600px;
    height:400px;
    border-radius:3px;
    overflow:hidden;
    position:absolute;
    z-index:999999;
    background-color:white;
    display:none;
  }
  .comeAndGoTitle{
    width:100%;
    position:absolute;
    top:0;
    left:0;
    height:40px;
    background-color:#80B0f9;
  }
  .comeAndGoTitle>p:nth-child(1){
    height:40px;
    line-height:40px;
    position:absolute;
    top:0;
    left:0;
    font-size:16px;
    padding-left:10px;
    color:#c3edff;
    margin:0;
  }
  .comeAndGoTitle>p:nth-child(2){
    height:20px;
    width:20px;
    position:absolute;
    top:10px;
    right:10px;
    cursor:pointer;
    margin:0;
  }
  .comeAndGoBody{
    position:absolute;
    height:280px;
    width:260px;
    border:1px solid #ccc;
    border-radius:5px;
  }
  .comeAndGoBodyLeft{
    left:20px;
    top:60px;
  }
  .comeAndGoBodyRight{
    top:60px;
    left:320px;
  }

  .comeAndGoBodySerach{
    overflow:hidden;
    position:absolute;
    left:0;
    height:30px;
    width:240px;
    border:1px solid #ccc;
    margin:0 10px;
    border-radius:5px;
    top:10px;
  }
  .comeAndGoBodySerach>input{
    border:none;
    outline:none;
    height:30px;
    width:185px;
    margin-left:20px;
  }
  .comeAndGoBodySerach>input:focus{
    border:none;
  }
  .comeAndGoBodyContent{
    position:absolute;
    left:0;
    width:243px;
    margin-left:15px;
    top:0;
    height:280px;
    overflow-y:auto;
    overflow-x:hidden;
  }
  .moveTri{
    position:absolute;
    left:290px;
    top:50px;
    cursor:pointer;
  }
  #moveTriToLeft{
    top:200px;
  }
  #moveTriToRight{
    top:170px;
  }
  .fafafa{
    cursor:pointer;
  }
  .fafafa>div{
    margin-left:20px;
  }
  .comeAndGoBodyContent label{
    display:block;
    margin-left:20px;
    cursor:pointer;

  }
  .labelDiv{
    content:'';
    position:absolute;
    height:15px;
    width:15px;
    border-radius:3px;
    border:1px solid #ccc;
    margin-left:-17px;
    margin-top:3px;
    cursor:pointer;
  }
  .comeAndGoBodyContent label input{
    position:absolute;
    visibility: hidden;
  }
  #alertTarget{
    position:relative;
    margin-left:15px;
    margin-top:5px;
    margin-bottom:5px;
    cursor:pointer;
    border:1px solid #ccc;
    border-radius:5px;
    float:left;
    min-height:35px;
    min-width:100px;
    color:#ccc;
    font-size:14px;
    padding-left:30px;
    padding-right:10px;
    line-height:35px;
    box-sizing:border-box;
  }
  #alertTarget ul{


    list-style: none;
    padding:0;
    margin:0;
  }
  #alertTarget ul li{
    display:inline-block;
    height:25px;
    margin:0 5px;
    color:#666;
    line-height:35px;
  }
  .serachsvg{
    position:absolute;
    right:5px;
    top:4.5px;
  }
  #comeAndGoConfirm {
    margin-top: 350px;
    margin-right: 20px;
    font-size: 15px;
    line-height: 30px;
    text-align: center;
    width: 100px;
    height: 30px;
    border-radius: 4px;
    color: #80B0F9;
    border: 1px solid #80B0F9;
    cursor: pointer;
    float: right;
    letter-spacing: 15px;
    text-indent: 15px;
  }
  #comeAndGoConfirm:hover{
      color: white;
      background: #80b0f9;
  }

  //两个选项框样式
  #twoChoose{
    position:fixed;
    left:0;
    right:0;
    z-index: 999999;
    border:1px solid #ccc;
    background:white;
    box-shadow:0px 1px 1px 1px #ccc;
    line-height:25px;
  }
  #twoChoose>div{
    padding:0 6px;
  }
  #twoChoose>div:hover{
    background:#80b0f9;
    color:white;
    cursor:pointer
  }
</style>
