Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}



Number.isNaN=Number.isNaN||function(value){return typeof value==="number"&&isNaN(value);};

var isPresent=function isPresent(datum){return datum!==undefined&&!Number.isNaN(datum);};

var AddPaging=function AddPaging(ComposedComponent,scrollViewRefPropName){return function(_React$Component){_inherits(_class,_React$Component);

function _class(props){_classCallCheck(this,_class);var _this=_possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).call(this,
props));

_this.refProp={};
_this.refProp[scrollViewRefPropName||'ref']=_this.getScrollViewRef.bind(_this);


_this.scrollX=0;
_this.scrollY=0;
_this.initialized=false;


_this.state={
totalPages:0,
currentPage:null};return _this;

}_createClass(_class,[{key:'initialize',value:function initialize()

{
if(this.initialized)return;
if(isPresent(this.state.totalPages)&&
isPresent(this.state.currentPage)){
this.initialized=true;
this.props.onInitialization&&this.props.onInitialization(this);
}
}},{key:'handleScroll',value:function handleScroll(

event){

this.props.onScroll&&this.props.onScroll(event);

var e=event.nativeEvent;


this.scrollViewWidth=e.layoutMeasurement.width;
this.scrollViewHeight=e.layoutMeasurement.height;
this.innerScrollViewWidth=e.contentSize.width;
this.innerScrollViewHeight=e.contentSize.height;


this.scrollX=e.contentOffset.x;
this.scrollY=e.contentOffset.y;

this.setPages();
}},{key:'setPages',value:function setPages()

{
var isHorizontal=this.props.horizontal;
var totalPages=void 0;
if(isHorizontal){
totalPages=Math.floor(this.innerScrollViewWidth/this.scrollViewWidth+0.5);

this.setState({
totalPages:totalPages,
currentPage:Math.min(Math.max(Math.floor(this.scrollX/this.scrollViewWidth+0.5)+1,0),totalPages)});

}else
{
totalPages=Math.floor(this.innerScrollViewHeight/this.scrollViewHeight+0.5);

this.setState({
totalPages:totalPages,
currentPage:Math.min(Math.max(Math.floor(this.scrollY/this.scrollViewHeight+0.5)+1,0),totalPages)});

}
}},{key:'componentWillUpdate',value:function componentWillUpdate(

nextProps,nextState){
if(this.props.onPageChange){
var sendEvent=false;
for(var key in nextState){
if(nextState.hasOwnProperty(key)){
var a=this.state[key];
var b=nextState[key];
if(a!==b&&!Number.isNaN(b)){
sendEvent=true;
}
}
}
if(sendEvent){
this.props.onPageChange(nextState);
}
}
}},{key:'measureScrollView',value:function measureScrollView(

cb){var _this2=this;
if(this._scrollView&&this._scrollView._scrollViewRef){
this._scrollView._scrollViewRef.measure(function(x,y,w,h){
_this2.scrollViewWidth=w;
_this2.scrollViewHeight=h;
cb&&cb();
});
}
}},{key:'measureInnerScrollView',value:function measureInnerScrollView(

cb){var _this3=this;
if(this._scrollView&&this._scrollView._innerViewRef){
this._scrollView._innerViewRef.measure(function(x,y,w,h){
_this3.innerScrollViewWidth=w;
_this3.innerScrollViewHeight=h;
cb&&cb();
});
}
}},{key:'_scrollTo',value:function _scrollTo(

page){
var isHorizontal=this.props.horizontal;
if(isHorizontal){
return{
x:(Math.min(this.state.totalPages,Math.max(1,page))-1)*this.scrollViewWidth,
y:0};

}else
{
return{
x:0,
y:(Math.min(this.state.totalPages,Math.max(1,page))-1)*this.scrollViewHeight};

}
}},{key:'scrollToPage',value:function scrollToPage(

page,animated){
if(this._scrollView){
var scrollTo=this._scrollTo(page);
scrollTo.animated=animated;
this._scrollView.scrollTo(scrollTo);
}
}},{key:'getCurrentPage',value:function getCurrentPage()

{
return this.state.currentPage;
}},{key:'scrollToPrevious',value:function scrollToPrevious()

{
this.scrollToPage(this.state.currentPage-1,false);
}},{key:'scrollToNext',value:function scrollToNext()

{
this.scrollToPage(this.state.currentPage+1,false);
}},{key:'componentDidMount',value:function componentDidMount()

{var _this4=this;
setTimeout(function(){
var succeededCbs=0;
var totalCbs=2;

var computeNewState=function computeNewState(){
if(++succeededCbs<totalCbs)return;

_this4.setPages();

_this4.initialize();
};



_this4.measureInnerScrollView(computeNewState);
_this4.measureScrollView(computeNewState);
});
}},{key:'handleContentSizeChange',value:function handleContentSizeChange(

width,height){
this.props.onContentSizeChange&&this.props.onContentSizeChange(width,height);


this.innerScrollViewWidth=width;
this.innerScrollViewHeight=height;

this.setPages();

this.initialize();
}},{key:'getScrollViewRef',value:function getScrollViewRef(

c){
this._scrollView=c;
}},{key:'render',value:function render()

{
return(
_react2.default.createElement(ComposedComponent,_extends({
scrollEventThrottle:this.props.scrollEventThrottle||16},
this.props,
this.refProp,{
onScroll:this.handleScroll.bind(this),
onContentSizeChange:this.handleContentSizeChange.bind(this)}),
this.props.children));


}}]);return _class;}(_react2.default.Component);};exports.default=


AddPaging;