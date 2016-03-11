/* 
 * 本指令用来实现鼠标拖动修改元素宽度的功能。
 * 指令对所属dom的结构有严格的要求。
 * HTML：
 * 
    <div class="content-wrapper" content-wrapper-min-height>
      <section class="panel-wrapper">
        <section class="left-panel">
          <section ui-view></section>
          <div class="resize-bar" sn-resize-bar min-width="200" max-width="400" bar-side="right"></div>
        </section>
        <section class="main-panel">
        </section>
        <section class="right-panel">
          <div class="resize-bar" sn-resize-bar min-width="200" max-width="400" bar-side="left"></div>
        </section>
      </section>
    </div>
 * CSS：
 *  .content-wrapper {
      position: relative;
    }
    .content-wrapper .panel-wrapper {
      position: absolute;
      display: block;
      height: 100%;
      top: 0;
      left: 200px;
      right: 0;
      height: 100%;
    }
    .content-wrapper > .panel-wrapper > .left-panel {
      position: absolute;
      display: block;
      height: 100%;
      left: 0;
      top: 0;
      width:200px;
      margin-left: -200px;
    }
    .content-wrapper > .panel-wrapper > .main-panel {
      position: absolute;
      display: block;
      height: 100%;
      top: 0;
      left: 0;
      right: 200px;
    }
    .content-wrapper > .panel-wrapper > .right-panel {
      position: absolute;
      display: block;
      height: 100%;
      top: 0;
      right: 0px;
      width:200px;
    }
 */

export default app => {
  app.directive("snResizeBar", [() => {
    return {
      restrict: 'A',
      priority: 0,
      link: (scope, ele, attr) => {
        // 判断拖动条是在左侧还是右侧
        let isLeftBar = attr.barSide == 'left';
        // 元素允许拖动到的最小和最大宽度
        let minWidth = +(attr.minWidth || Number.MIN_VALUE);
        let maxWidth = +(attr.maxWidth || Number.MAX_VALUE);
        minWidth = Math.min(minWidth, maxWidth);
        maxWidth = Math.max(minWidth, maxWidth);
        // 改变形状的元素，和被影响的相邻元素
        // 左拖动条影响左邻元素，右拖动条影响右邻用户
        let parentEle = ele[0].parentElement;
        let siblingEle = isLeftBar ? 
          parentEle.previousElementSibling : parentEle.nextElementSibling;
        // 起始位置、元素初始宽度、相邻元素的left或right值，允许变动的最大值和最小值
        let startPos, originWidth, siblingOriginMove, minDistance, maxDistance;
        // 通知被影响元素的resize事件
        let event = document.createEvent('HTMLEvents');
        event.initEvent('resize');
        // 给拖动条添加式样
        let style = ele[0].style;
        style.cursor = "col-resize";
        style.display = 'block';
        style.position = 'absolute';
        style.height = '100%';
        style.width = '4px';
        style[isLeftBar ? 'left' : 'right'] = '0';
        
        // 鼠标按下事件，获取初始值，并开始监听mousemove
        let mousedownEvt = evt => {
          startPos = evt.x;
          originWidth = window.getComputedStyle(parentEle).width;
          originWidth = +(originWidth.substring(0, originWidth.length-2));
          siblingOriginMove = window.getComputedStyle(siblingEle)[isLeftBar ? 'right' : 'left'];
          siblingOriginMove = +(siblingOriginMove.substring(0, siblingOriginMove.length-2));
          minDistance = minWidth - originWidth;
          maxDistance = maxWidth - originWidth;
          document.addEventListener('mousemove', mousemoveEvt);
        };
        // 鼠标up事件，取消mousemove事件监听
        let mouseupEvt = evt => {
          startPos = undefined;
          console.info('do mouseup');
          document.removeEventListener('mousemove', mousemoveEvt);
        };
        // 根据当前位置和初始位置，修改变形元素和相邻元素的style属性
        let mousemoveEvt = evt => {
          if(startPos === undefined){
            document.removeEventListener('mousemove', mousemoveEvt);
            return;
          }
          let distance = isLeftBar ? (startPos - evt.x) : (evt.x -  startPos);
          if(distance >= minDistance && distance <= maxDistance) {
            parentEle.style.width = (originWidth + distance) + 'px';
            siblingEle.style[isLeftBar ? 'right' : 'left'] = ((siblingOriginMove||0) + distance) + 'px';
            distance && siblingEle.dispatchEvent(event);
          }
        };
        ele[0].addEventListener('mousedown', mousedownEvt);
        document.addEventListener('mouseup', mouseupEvt);
      }
    }
  }])
}