/* input-mask指令
   本指令用于在input输入框里加入默认格式功能
   比如希望用户输入 01:00 的时间格式，用户只需依次输入0100即可。
   使用方法：<input input-mask="?{2}:?{2}" input-mask-validate="validateInput" ng-model="time">
**/
export default app => {

  app.directive('inputMask', ['$compile',
    function ($compile) {

      /* 光标位置是否正确 */
      function isValidCaretPosition(pos) {
        return maskCaretMap.indexOf(pos) > -1;
      }

      /* 获取光标位置 */
      function getCaretPosition(input) {
        if (!input)
          return 0;
        if (input.selectionStart !== undefined) {
          return input.selectionStart;
        } else if (document.selection) {
          if (isFocused(iElement[0])) {
            // Curse you IE
            input.focus();
            var selection = document.selection.createRange();
            selection.moveStart('character', input.value ? -input.value.length : 0);
            return selection.text.length;
          }
        }
        return 0;
      }

      /* 设置光标位置 */
      function setCaretPosition(input, pos) {
        if (!input)
          return 0;
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
          return; // Input's hidden
        }
        if (input.setSelectionRange) {
          // if (isFocused(iElement[0])) {
          // input.focus();
          input.setSelectionRange(pos, pos);
          // }
        }
        else if (input.createTextRange) {
          // Curse you IE
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      }

      /* 获取选中文本的长度 */
      function getSelectionLength(input) {
        if (!input)
          return 0;
        if (input.selectionStart !== undefined) {
          return (input.selectionEnd - input.selectionStart);
        }
        if (document.selection) {
          return (document.selection.createRange().text.length);
        }
        return 0;
      }

      /* 解析站位字符表达式 */
      function analyzeMask(mask) {
        //转义 \? -> \?\
        var r = /\?\{\d\}/g;
        var escapedMask = mask.replace(/\\\?/g, '\?\\');
        var matches = escapedMask.match(r);
        var masks = [];
        var firstIdx, lastIdx;
        matches.forEach(function (item, index) {
          /* 
           */
          var index = escapedMask.indexOf(item);
          firstIdx === undefined && (firstIdx = index);
          masks.push.apply(masks, escapedMask.substr(0, index).split(''));
          var maskLength = +item.match(/\d/)[0];
          var content = Array.apply(null, new Array(maskLength)).map(function (item) {
            return {
              value: '_'
            }
          });
          masks.push.apply(masks, content);
          escapedMask = escapedMask.substr(index + item.length);
        });
        lastIdx = masks.length;
        masks.push.apply(masks, escapedMask.split(''));

        return {
          masks: masks,
          firstIdx: firstIdx,
          lastIdx: lastIdx
        }
      }

      /* 生成formatter函数 */
      function generateFormatter(masks, element, ngModelCtrl) {
        return function (modelValue) {
          if (modelValue) {
            var modelValueList = modelValue.split('');
            /* 如果第一个占位符的位置不在最开始，则跳过第一个静态字符组 */
            masks.forEach(function (item, index) {
              item.value && (item.value = modelValueList[index]);
            });
          }
          var value = masks.map(function (item, index) {
            return item.value || item
          }).join('');
          return value;
        }
      }
      /* 生成parser函数 */
      function generateParser(masks, element) {
        return function (viewValue) {
          return viewValue
        }
      }

      return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
          inputMask: '@',
          inputMaskValidate: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {
          // 表达式解析结果对象 masks 
          var rst = analyzeMask(scope.inputMask);
          scope.masks = rst.masks;
          scope.firstIdx = rst.firstIdx;
          scope.lastIdx = rst.lastIdx;
          scope.inputMaskValidate = angular.isFunction(scope.inputMaskValidate) ? scope.inputMaskValidate : function () {
            return true;
          };

          var formatterFunc = generateFormatter(scope.masks, element, ngModelCtrl);
          ngModelCtrl.$formatters.push(formatterFunc);
          ngModelCtrl.$parsers.unshift(generateParser(scope.masks, element));

          var oldCaretLength = scope.masks.length, oldCaretIdx = 0,
            isKeyLeftArrow, isKeyRightArror, isKeyBackspace, isKeyDelete;

          function keyEventHanlder(evt) {
            var stopEvt = function () {
              evt.preventDefault();
              evt.stopPropagation();
            }
            var caretIdx = getCaretPosition(this);
            var caretLength = getSelectionLength(this);
            var m = scope.masks;
            var eventWhich = evt.which;
            /* 判断键盘按键类型 */
            if (eventWhich === 16 || eventWhich === 17 || eventWhich === 18) {
              return;
            }

            if (evt.type == 'keydown') {
              isKeyLeftArrow = eventWhich === 37 && !evt.shiftKey,
              isKeyRightArror = eventWhich === 39 && !evt.shiftKey,
              // Necessary due to "input" event not providing a key code
              isKeyBackspace = eventWhich === 8,
              isKeyDelete = eventWhich === 46
              ;
              /* 处理左移 */
              if (isKeyLeftArrow) {
                if (caretIdx <= scope.firstIdx) {
                  caretIdx = scope.firstIdx;
                } else if (m[caretIdx - 1].value) {
                  caretIdx--;
                } else {
                  while (--caretIdx >= 0) {
                    if (m[caretIdx].value) {
                      caretIdx++;
                      break;
                    }
                  }
                }
                setCaretPosition(this, caretIdx);
                stopEvt();
                return;
              }
              /* 处理右移 */
              if (isKeyRightArror) {
                if (caretIdx >= scope.lastIdx) {
                  caretIdx = scope.lastIdx;
                } else if (m[caretIdx].value) {
                  caretIdx++;
                } else {
                  while (++caretIdx <= m.length) {
                    if (m[caretIdx - 1].value) {
                      caretIdx--;
                      break;
                    }
                  }
                }
                setCaretPosition(this, caretIdx);
                stopEvt();
                return;
              }
              oldCaretLength = caretLength;
              oldCaretIdx = caretIdx;
            }
                                        
            /* 处理输入 */
            if (evt.type == 'input') {
              var curValue = this.value.split('');
              var inputLength = curValue.length + oldCaretLength - m.length;
              var i = 0;
              var dealCaretIdx = (isKeyDelete || isKeyBackspace) ? caretIdx : oldCaretIdx;
              var inputVal, inputValList = {};
              if (dealCaretIdx <= scope.lastIdx) {
                for (; i <= oldCaretLength && i <= scope.lastIdx; i++) {
                  if (m[dealCaretIdx + i] && m[dealCaretIdx + i].value) {
                    inputVal = i < inputLength ? curValue[dealCaretIdx + i] : '_';
                    inputValList[dealCaretIdx + i] = inputVal;
                  }
                }
                if (scope.inputMaskValidate(inputValList, m)) {
                  angular.forEach(inputValList, function (value, key) {
                    m[key].value = value;
                  });
                }
              }
              isKeyDelete && caretIdx++;
              if (isKeyBackspace) {
                if (!m[caretIdx].value) {
                  while (caretIdx >= scope.firstIdx && !m[caretIdx].value) {
                    caretIdx--;
                  }
                  caretIdx++;
                }
              } else {
                if (caretIdx >= scope.lastIdx) {
                  caretIdx = scope.lastIdx;
                } else if (!m[caretIdx].value) {
                  while (caretIdx <= scope.lastIdx && !m[caretIdx].value) {
                    caretIdx++;
                  }
                }
              }
              this.value = formatterFunc();
              ngModelCtrl.$setViewValue(this.value);
              recrectCaredPosition(this, caretIdx);
              stopEvt();
              return;
            }
            return;
          }

          function mouseEventHanlder(evt) {
            /* 分析当前光标位置，如果光标不在可编辑的占位符位置上，则移动光标 */
            var caretIdx = getCaretPosition(this);
            var caretLength = getSelectionLength(this);
            if (caretLength < 1) {
              recrectCaredPosition(this, caretIdx);
            }
            console.info(evt.type);
          }

          /* 修正光标位置 */
          function recrectCaredPosition(ele, pos) {
            var m = scope.masks;
            var originPos = pos;
            if (pos <= scope.firstIdx) {
              pos = scope.firstIdx;
            } else if (pos >= scope.lastIdx) {
              pos = scope.lastIdx
            } else {
              while (pos >= 0) {
                if (m[pos].value) {
                  break;
                } else if (m[pos - 1].value) {
                  break;
                }
                pos--;
              }
              if (pos < 0) {
                pos = originPos;
                while (pos < m.length) {
                  if (m[pos].value) {
                    break;
                  } else if (m[pos + 1].value) {
                    break;
                  }
                  pos++
                }
              }
            }
            setCaretPosition(ele, pos);
            if (pos != originPos) {
              return true;
            } else {
              return false;
            }
          }

          element.on('input', keyEventHanlder);
          element.keydown(keyEventHanlder);
          element.focus(mouseEventHanlder);
          element.mouseup(mouseEventHanlder);
        }
      }
    }
  ])
};