// ==UserScript==
// @name         bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       author
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
  var playbackRates = [1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 6];
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
  controlContainer.style.padding = "15px";
  controlContainer.style.background = "#000";
  controlContainer.style.borderRadius = "10px";

  // 遍历播放速度数组，并为每个速度创建一个按钮
  for (var i = 0; i < playbackRates.length; i++) {
    // 创建按钮元素
    var buttonElement = document.createElement("button");
    buttonElement.innerText = "x" + playbackRates[i];
    buttonElement.style.marginRight = "5px";
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
  // 监听键盘事件
  document.addEventListener("keydown", function (event) {
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
    // 判断是否松开数字键
    if (event.keyCode >= 48 && event.keyCode <= 57) { // keyCode 48-57 对应数字键0-9
      // 停止计时器
      clearInterval(timer);
      // 暂停视频播放
      videoElements[0].pause();
    }
  });
})();