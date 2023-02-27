// ==UserScript==
// @name         bilibili
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       feliks
// @match        https://*.bilibili.com/video/*
// @icon         https://www.felikschen.xyz/Personal/static/friends/Zmiemie/favicon.ico
// @grant        none
// @grant        GM_log
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
(function () {
  'use strict';
  //打开页面时，获取localStorage中的播放速度
  var playbackRate = localStorage.getItem("playbackRate");
  //如果localStorage中有播放速度，则设置为当前播放速度
  if (playbackRate) {
    var videoElements1 = document.getElementsByTagName("video");
    for (var j = 0; j < videoElements1.length; j++) {
      videoElements1[j].playbackRate = playbackRate;
    }
  }
  // 定义不同的播放速度
  var playbackRates = [1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 10];
  var currentSpeed = 1;
  var timer = null;

  // 获取所有的视频元素
  var videoElements = document.getElementsByTagName("video");

  // 控制按钮div
  var controlContainer = document.createElement("div");
  controlContainer.style.position = "fixed";
  controlContainer.style.left = "25px";
  controlContainer.style.top = "100px";
  controlContainer.style.zIndex = "9999";
  controlContainer.style.padding = "10px 0";
  controlContainer.style.background = "#000";
  controlContainer.style.borderRadius = "10px";
  controlContainer.style.display = "flex";
  controlContainer.style.flexDirection = "column";

  var p = document.createElement("p");
  p.innerText = "长按加速，短按切换";
  p.style.color = "#fff";
  p.style.margin = "0";
  p.style.transform = "scale(0.66)";
  controlContainer.appendChild(p);

  // 遍历播放速度数组，并为每个速度创建一个按钮
  for (var i = 0; i < playbackRates.length; i++) {
    // 创建按钮元素
    var buttonElement = document.createElement("button");
    buttonElement.innerText = "x" + playbackRates[i];
    buttonElement.style.margin = "5px auto";
    buttonElement.style.width = "40px";
    buttonElement.style.height = "25px";
    buttonElement.style.borderRadius = "5px";
    buttonElement.setAttribute("data-playbackRate", playbackRates[i]);

    // 按钮点击事件
    buttonElement.addEventListener("click", function () {
      var newPlaybackRate = parseFloat(this.getAttribute("data-playbackRate"));
      localStorage.setItem('playbackRate', newPlaybackRate);
      for (var j = 0; j < videoElements.length; j++) {
        videoElements[j].playbackRate = newPlaybackRate;
        videoElements[j].play();
      }
    });
    // 添加到父容器
    controlContainer.appendChild(buttonElement);
  }
  // 添加到页面
  document.body.appendChild(controlContainer);

  //获取controlContainer的高度
    var divHeight = controlContainer.offsetHeight;
    console.log('高度', divHeight);
    var span = document.createElement("span");
    span.innerText = ">";
    span.fontSize = "12px";
    span.style.display = 'none';
    span.style.color = "#fff";
    span.style.position = "absolute";
    span.style.right = "5px";
    span.style.height = divHeight + "px";
    span.style.lineHeight = divHeight + "px";
    controlContainer.appendChild(span);


  // 监听键盘事件
  var count = 0;
  document.addEventListener("keydown", function (event) {
    //按下count++,用于判断长按和短按
    count++;
    localStorage.setItem('count', count);
    console.log(count)
    // 判断按下的是否为数字键
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      // 获取按下的数字
      var speed = event.keyCode - 48;
      //设为当前播放速度
      currentSpeed = speed;
      //存
      localStorage.setItem('playbackRate', speed);
      for (var i = 0; i < videoElements.length; i++) {
        videoElements[i].playbackRate = speed;
        videoElements[i].play();
      }
      // 开始计时器，定时检查是否松开键盘
      timer = setInterval(function () {
        // 判断是否松开键盘
        if (!event.repeat) {
          // 停止计时器
          clearInterval(timer);
        }
      }, 500);
    }
  });
  // 键盘
  document.addEventListener("keyup", function (event) {
    //count=1,短按-->松开设置倍速；count>1,长按-->松开暂停
    if (count == 1) {
      videoElements[0].playbackRate = currentSpeed;
    } else {
      videoElements[0].pause()
      count = 0
    }
    //松开重置count
    count = 0
  });


    //拖动
    //拖动控制按钮
    var drag = false;
    var x, y;
    controlContainer.addEventListener('mousedown', function (e) {
      e.preventDefault();
      drag = true;
      x = e.clientX - controlContainer.offsetLeft;
      y = e.clientY - controlContainer.offsetTop;
    });
    document.addEventListener('mousemove', function (e) {
      if (drag) {
        controlContainer.style.left = e.clientX - x + 'px';
        controlContainer.style.top = e.clientY - y + 'px';
        getRight();
      }
    });
    document.addEventListener('mouseup', function (e) {
      drag = false;
    });


    function getRight() {
      //判断controlContainer是否超出左边界
      if (controlContainer.offsetLeft < -80) {
        span.style.display = 'block';
        console.log('超出左边界', controlContainer.offsetLeft);
      }else{
        span.style.display = 'none';
      }
    }

    //设置hover事件
    controlContainer.addEventListener('mouseover', function () {
      controlContainer.style.cursor = 'pointer';
    });

    //点击恢复
    span.addEventListener('click', function () {
      var timer = setInterval(function () {
        controlContainer.style.left = controlContainer.offsetLeft + 4 + 'px';
        if (controlContainer.offsetLeft >= 25) {
          clearInterval(timer);
          span.style.display = 'none';
        }
      }, 1);
    });
})();
