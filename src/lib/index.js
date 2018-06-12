'use strict';

//var fs = require('fs');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda'),
    camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');
    //minimapModule = require('diagram-js-minimap');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var bpmnModeler = new BpmnModeler({
    container: canvas,
    propertiesPanel: {
        parent: '#js-properties-panel'
    },
    additionalModules: [
        // minimapModule,
        propertiesPanelModule,
        propertiesProviderModule
    ],
    moddleExtensions: {
        camunda: camundaModdleDescriptor
    }
});

//var newDiagramXML = require('../newDiagram.bpmn');

var newDiagramXML = `
                      <?xml version="1.0" encoding="UTF-8"?>
                    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
                      <bpmn2:process id="Process_1" isExecutable="false">
                        <bpmn2:startEvent id="StartEvent_1"/>
                      </bpmn2:process>
                      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
                          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                            <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
                          </bpmndi:BPMNShape>
                        </bpmndi:BPMNPlane>
                      </bpmndi:BPMNDiagram>
                    </bpmn2:definitions>
                    `;
var superxml = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:extensionElements>
      <camunda:properties>
        <camunda:property name="所属用户组" value="222" />
        <camunda:property name="所属用户" value="111" />
      </camunda:properties>
    </bpmn2:extensionElements>
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:extensionElements>
        <camunda:properties>
          <camunda:property name="所属用户组" value="2522" />
          <camunda:property name="所属用户" />
        </camunda:properties>
      </bpmn2:extensionElements>
    </bpmn2:startEvent>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="412" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`

function createNewDiagram() {
    openDiagram(newDiagramXML);
}

function openDiagram(xml) {

    bpmnModeler.importXML(xml, function(err) {

        if (err) {
            container
                .removeClass('with-diagram')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-diagram');
        }


    });
}

function saveSVG(done) {
     bpmnModeler.saveSVG(done);

}

function saveDiagram(done) {

    bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
    });
}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function(e) {

            var xml = e.target.result;

            callback(xml);
        };

        reader.readAsText(file);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
    window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
    registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function() {
    var downloadLink = $('#downloadBpmn');
    var downloadSvgLink = $('#saveSvg');
    var openBpmn = $('#openBpmn');
    var saveBpmn = $('#saveBpmn')

    createNewDiagram(); //直接生成BPMN



    $('.buttons a').click(function(e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    var debounce = require('lodash/debounce');

    var exportArtifacts = debounce(function() {

        saveSVG(function(err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function(err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
        saveBpmn.addClass('active')
        $('#app').parents('iframe').attr('data-address', decodeURIComponent(downloadLink.attr('href').split(',')[1]))
    }, 500);
    openBpmn.addClass('active')
    bpmnModeler.on('commandStack.changed', exportArtifacts);

    saveBpmn.off('click').on('click', function() {

        if ($(this).hasClass('active')) console.log(decodeURIComponent(downloadLink.attr('href').split(',')[1]))
    })

    openBpmn.off('click').on('click', function(e) {
        // $('#uploadFile').trigger('click')
        console.log(e.target.file)

        openDiagram(superxml)
    })
  downloadSvgLink.off('click').on('click',function(){
        console.log(decodeURIComponent(downloadSvgLink.attr('href').split(',')[1]))
    return false
  })


    //重置事件
    $('<button class="reset">reset</button>').appendTo($('#app'))
    $('.reset').on('click',function(){
      bpmnModeler.get("zoomScroll").reset()
    })








$('<div class="comeAndGoBkg"></div><div class="comeAndGo">\n' +
  '    <div class="comeAndGoTitle"><p>提醒人</p><p id="closeAll"><svg width="21" height="21"> <line x1="19.5" y1="0.5" x2="0.5" y2="19.5" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round"/><line x1="19.5" y1="19.5" x2="0.5" y2="0.5" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round"/></svg></p></div>\n' +
  '    <div class="comeAndGoBody comeAndGoBodyLeft">\n' +
  '    <div class="comeAndGoBodyContent comeAndGoBodyLeftContent"></div>\n' +
  '    </div>\n' +
  '    <div class="comeAndGoBody comeAndGoBodyRight">\n' +
  '    <div class="comeAndGoBodyContent comeAndGoBodyRightContent"></div>\n' +
  '    </div>\n' +
  '    <div class="moveTri" id="moveTriToLeft"><svg width="21" height="21"><path d="M10.5,1A9.5,9.5,0,1,1,1,10.5,9.51,9.51,0,0,1,10.5,1m0-1A10.5,10.5,0,1,0,21,10.5,10.5,10.5,0,0,0,10.5,0Z" style="fill:#ccc"/><polyline points="13 5.5 8 10.5 13 15.5" style="fill:none;stroke:#80b0f9;stroke-linecap:round;stroke-miterlimit:10"/></svg></div>\n' +
  '    <div class="moveTri" id="moveTriToRight"><svg width="21" height="21"> <path d="M10.5,1A9.5,9.5,0,1,1,1,10.5,9.51,9.51,0,0,1,10.5,1m0-1A10.5,10.5,0,1,0,21,10.5,10.5,10.5,0,0,0,10.5,0Z" style="fill:#ccc"/><polyline points="9 5.5 14 10.5 9 15.5" style="fill:none;stroke:#80b0f9;stroke-linecap:round;stroke-miterlimit:10"/></svg></div>\n' +
  '    <div class="buttondiv" id="comeAndGoConfirm">保存</div>\n' +
  '\n' +
  '</div>').appendTo($('body'))
  $('<div id="twoChoose">\n' +
    '  <div>用户</div>\n' +
    '  <div>用户组</div>\n' +
    '</div>').appendTo($('body'))





  //穿梭框事件
  window.onresize=function(){
    $('.comeAndGoBkg').trigger('click')
  }
  window.onscroll=function(){
    $('.comeAndGoBkg').trigger('click')
  }
  $('.comeAndGoBkg').on('click',function(){
    $('#twoChoose').hide()
    $('.comeAndGoBkg').hide()
    $('.comeAndGo').hide()
  })
  $('#closeAll').on('click',function(){
  $('.comeAndGoBkg').hide()
  $('.comeAndGo').hide()
})
  $('#moveTriToRight').on('click',function(){   //左侧点击跳到右边
    $('.comeAndGoBodyLeftContent label').each(function(){
      if($(this).find('input').is(':checked'))
      {
        $('.comeAndGoBodyRightContent').append($(this))
        $(this).find('input').trigger('click')
      }
    })
  })
  $('#moveTriToLeft').on('click',function(){   //右点击跳到左边
    $('.comeAndGoBodyRightContent label').each(function(){
      if($(this).find('input').is(':checked'))
      {
        var sonid = $(this).data('father')
        var that = $(this)
        $('div.fafafa').each(function(){
          var fathernum = $(this).data('id')
          var thatfather = $(this)

          if(fathernum==sonid)
          {
            thatfather.append(that)
            thatfather.append(thatfather.children().get().sort(function(a,b){
              return $(a).data('id').split('num')[0]-$(b).data('id').split('num')[0]
            }))
          }
        })
      }


    })
  })
  $('.comeAndGoBodyContent').on('click','label',function(e){

    if($(this).children('input').prop('checked')===true)
    {

      $(this).children('div').html('<svg  width=15 height=15 viewBox="0,0,9,9"><polygon fill-rule="evenodd" clip-rule="evenodd" fill="#80B0F9" points="7.574,0 3.566,5 1.099,2.876 0,4.31 3.87,7.51 8.982,1.13"/><rect id="_x3C_切片_x3E_" x="-0.52" y="-0.406" fill-rule="evenodd" clip-rule="evenodd" fill="none" width="10" height="8"/></svg>')
    }else{
      $(this).children('div').html('')
    }
    e.stopPropagation()
  })
  $('.comeAndGoBodyContent').on('click','.fafafa', function () {
    if ($(this).data('flag') == false) {
      $(this).data('flag', true)
      $(this).children().hide()
      return false

    } else {
      $(this).data('flag', false)
      $(this).children().show()
      return false
    }

  })  //添加树图点击展开事件
  $('#comeAndGoConfirm').on('click',function(){
    var result = []
    $('.comeAndGoBodyRightContent label').each(function(){
      result.push($(this).text())
    })
    $(thisTarget).empty().val(result.join(','))//把选中的东西加进去
    $('.comeAndGo').hide()
    $('.comeAndGoBkg').hide()
    handleChange({type: 'change', delegateTarget: thisTarget});  //这行很重要，用来触发插件本身的储存事件

  });
  $('#twoChoose').on('click','div',function(){

    $(thisTarget).empty().val($(this).text())//把选中的东西加进去
    $('#twoChoose').hide()
    $('.comeAndGoBkg').hide()

    handleChange({type: 'change', delegateTarget: thisTarget});  //这行很重要，用来触发插件本身的储存事件

  });
  var comeandgodata =
    [
      {
        'name':'计算机学院',
        'content':[
          {
            'name':'计算机科学与技术',
            'content':[
              {
                'name':'计算机一班',
                'content':'没人哈哈'
              },
              {
                'name':'计算机二班',
                'content':'也没人哈哈哈'
              },
              {
                'name':'计算机三班',
                'content':'依旧没人哈哈哈'
              },
              {
                'name':'计算机四班',
                'content':[
                  {
                    'name':'王阔',
                    'content':'18701452123'
                  },
                  {
                    'name':'周杰伦',
                    'content':'13800138000'
                  },
                  {
                    'name':'周杰',
                    'content':'13800138000'
                  },
                  {
                    'name':'周润发',
                    'content':'13800138000'
                  },
                  {
                    'name':'周巡',
                    'content':'13800138000'
                  },
                  {
                    'name':'周星驰',
                    'content':'13800138000'
                  },
                  {
                    'name':'周树人',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          },
          {
            'name':'数字媒体',
            'content':[
              {
                'name':'数媒一班',
                'content':[
                  {
                    'name':'李白',
                    'content':'13800138000'
                  },
                  {
                    'name':'李荣浩',
                    'content':'13800138000'
                  },
                  {
                    'name':'李清照',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'数媒二班',
                'content':'没人哈哈哈'
              },
              {
                'name':'数媒三班',
                'content':[
                  {
                    'name':'李云龙',
                    'content':'18701452123'
                  },
                  {
                    'name':'李嘉诚',
                    'content':'13800138000'
                  },
                  {
                    'name':'李宇春',
                    'content':'13800138000'
                  },
                  {
                    'name':'李雪健',
                    'content':'13800138000'
                  },
                  {
                    'name':'李幼斌',
                    'content':'13800138000'
                  },
                  {
                    'name':'李晨',
                    'content':'13800138000'
                  },
                  {
                    'name':'李玉刚',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'数媒四班',
                'content':[
                  {
                    'name':'李自成',
                    'content':'18701452123'
                  },
                  {
                    'name':'李天一',
                    'content':'13800138000'
                  },
                  {
                    'name':'李大钊',
                    'content':'13800138000'
                  },
                  {
                    'name':'李商隐',
                    'content':'13800138000'
                  },
                  {
                    'name':'李元霸',
                    'content':'13800138000'
                  },
                  {
                    'name':'李煜',
                    'content':'13800138000'
                  },
                  {
                    'name':'李师师',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          },
          {
            'name':'信息安全',
            'content':[
              {
                'name':'信安一班',
                'content':[
                  {
                    'name':'王安石',
                    'content':'13800138000'
                  },
                  {
                    'name':'王勃',
                    'content':'13800138000'
                  },
                  {
                    'name':'王阳明',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'信安二班',
                'content':[
                  {
                    'name':'王处一',
                    'content':'18701452123'
                  },
                  {
                    'name':'王健林',
                    'content':'13800138000'
                  },
                  {
                    'name':'王思聪',
                    'content':'13800138000'
                  },
                  {
                    'name':'王国维',
                    'content':'13800138000'
                  },
                  {
                    'name':'王翦',
                    'content':'13800138000'
                  },
                  {
                    'name':'王维',
                    'content':'13800138000'
                  },
                  {
                    'name':'王昭君',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'信安三班',
                'content':'没人'
              },
              {
                'name':'信安四班',
                'content':[
                  {
                    'name':'王羲之',
                    'content':'18701452123'
                  },
                  {
                    'name':'王献之',
                    'content':'13800138000'
                  },
                  {
                    'name':'王实甫',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'name':'文法学院',
        'content':[
          {
            'name':'法律',
            'content':[
              {
                'name':'法一班',
                'content':[
                  {
                    'name':'法海',
                    'content':'18701452123'
                  },
                  {
                    'name':'法兰西',
                    'content':'13800138000'
                  },
                  {
                    'name':'法外狂徒',
                    'content':'13800138000'
                  },
                  {
                    'name':'法院',
                    'content':'13800138000'
                  },
                  {
                    'name':'法术',
                    'content':'13800138000'
                  },
                  {
                    'name':'法宝',
                    'content':'13800138000'
                  },
                  {
                    'name':'法律',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'法二班',
                'content':'也没人哈哈哈'
              },
              {
                'name':'法三班',
                'content':'依旧没人哈哈哈'
              },
              {
                'name':'法四班',
                'content':[
                  {
                    'name':'法则',
                    'content':'18701452123'
                  },
                  {
                    'name':'法规',
                    'content':'13800138000'
                  },
                  {
                    'name':'法氏小面包还是达利园的好',
                    'content':'13800138000'
                  },
                  {
                    'name':'法术暴击',
                    'content':'13800138000'
                  },
                  {
                    'name':'法术连击',
                    'content':'13800138000'
                  },
                  {
                    'name':'法术波动',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          },
          {
            'name':'广告',
            'content':[
              {
                'name':'广告一班',
                'content':[
                  {
                    'name':'广阔',
                    'content':'13800138000'
                  },
                  {
                    'name':'广大',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'广告二班',
                'content':[
                  {
                    'name':'广播',
                    'content':'13800138000'
                  },
                  {
                    'name':'广场舞',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'广告三班',
                'content':[
                  {
                    'name':'广播',
                    'content':'15001217192'
                  },
                  {
                    'name':'广州',
                    'content':'13800138000'
                  },
                  {
                    'name':'广东',
                    'content':'13800138000'
                  },
                  {
                    'name':'广西',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'name':'艺术学院',
        'content':[
          {
            'name':'婴幼儿护理',
            'content':[
              {
                'name':'幼儿一班',
                'content':[
                  {
                    'name':'握草',
                    'content':'18701452123'
                  },
                  {
                    'name':'谁能',
                    'content':'13800138000'
                  },
                  {
                    'name':'告诉',
                    'content':'13800138000'
                  },
                  {
                    'name':'我',
                    'content':'13800138000'
                  },
                  {
                    'name':'艺术',
                    'content':'13800138000'
                  },
                  {
                    'name':'学院',
                    'content':'13800138000'
                  },
                  {
                    'name':'有啥专业',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'幼儿二班',
                'content':'也没人哈哈哈'
              }
            ]
          },
          {
            'name':'产后护理',
            'content':[
              {
                'name':'产后一班',
                'content':[
                  {
                    'name':'要想富',
                    'content':'13800138000'
                  },
                  {
                    'name':'先修路',
                    'content':'13800138000'
                  }
                ]
              },
              {
                'name':'产后二班',
                'content':[
                  {
                    'name':'少生孩子',
                    'content':'13800138000'
                  },
                  {
                    'name':'多种树',
                    'content':'13800138000'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  var num = 0;
  var  idnum = 0;
  var thisTarget = $('body')

$('#js-properties-panel').on('click','.wksInput',(e)=> {
  thisTarget = e.target
   if($(thisTarget).index()==0){//判断点击的是第一个就弹出下拉框
     var _this= $(thisTarget)
     $('#twoChoose').css({'left':_this.offset().left+1,'top':_this.offset().top+23,'width':_this.width()+12}).show()
     $('.comeAndGoBkg').show()
   }else if($(thisTarget).index()==1) //如果是第二个就弹出穿梭框
   {
     num = 0 ;
     idnum = 0;
     $('.comeAndGoBodyContent').empty() //清空树图
     showMeTheMoney(comeandgodata, $('.comeAndGoBodyLeftContent'))//新增树图
     $('.fafafa').trigger('click') // 把树图收起来
     $('.comeAndGo').show()
     $('.comeAndGoBkg').show()
     if(thisTarget.value!='')
     {

       $(thisTarget).val().split(',').forEach(function(val,ind){
         var _that = val

          $('label[data-id]').each(function(){
            if($(this).text()==_that)
            {
              $(this).trigger('click').show()
            }

          })
       })
       $('#moveTriToRight').trigger('click')
     }

   }else{
    return
   }


}).on('focus','.wksInput',function(){
  $(this).blur()   // 不能让用户自己输入，所以只要聚焦就失焦
})

  function showMeTheMoney(data, obj) {
    num += 1
    for (var i = 0; i < data.length; i++) {


      if (Object.prototype.toString.call(data[i].content) === '[object Array]') {
        idnum += 1;
        obj.append('<div class="fafafa" data-flag=false data-id="' + i + 'num' + num + '">' + data[i].name + '</div>')
        showMeTheMoney(data[i].content, $('div[data-id="' + i + 'num' + num + '"'))
      }
      else {
        idnum += 1;
        obj.append('<label for="' + 'checkbox' + idnum + i + num + '" data-id="' + i + 'num' + num + '" data-father="' + obj.data('id') + '" ><div class="labelDiv"></div><input type="checkbox" name="checkbox" value="' + data[i].content + '" id="' + 'checkbox' + idnum + i + num + '"/>' + data[i].name + '</label>')

      }
    }

  }   // 数据添加函数
});

