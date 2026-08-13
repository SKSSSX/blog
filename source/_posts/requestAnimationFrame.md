---
title: requestAnimationFrame解决传统定时器的BUG
subtitle: requestAnimationFrame
categories:
  - React
tags:
  - React
keywords: 
  - requestAnimationFrame
  - setInterval
  - setTimeout
  - 倒计时组件
copyright: true
date: 2021-11-07 11:05:45
---

{% note info %}
## 引言
{% endnote %}

{% blockquote %}
当你写一个倒计时组件时，可能会出现的解决方案是应用 setInterval来做的。
我摘取网上的setInterval的实例代码，测试一下这个倒计时的误差。
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">读者的疑问：一个倒计时组件，需要做的这么精准吗？</span>
我的回答：这要看你对性能的要求是否是精益求精了，本着对计时精度的严格要求，尽量缩小倒计时误差，减小手机浏览器的内存消耗等很有必要；最重要的是，为以后的购物“秒杀”做准备，此组件扩展成“秒杀组件”是很简单的事。
{% endblockquote %}

<!-- more -->

{% note warning %}
## 并不精确的setInterval
{% endnote %}

{% blockquote %}
作者：善宝橘
请阅读文章：https://juejin.cn/post/6882287025400070152
代码在线演示：https://codepen.io/liuluffy/pen/NWrqdbz
{% endblockquote %}

### 具体代码如下：

{% blockquote %}
JS：
{% endblockquote %}

{% codeblock %}
class Clock extends React.Component{
  constructor(props){
    super(props)
    this.state={
      minute:60,
      second:60
    }
    this.start = this.start.bind(this)
    this.no = this.no.bind(this)
    this.end = this.end.bind(this)
  }
  
  start(){
    if(this.state.second>0){
      this.setState({
        minute:this.state.minute,
        second:this.state.second - 1
      }) 
    }
    else{
      console.log('结束', new Date().getTime())
       this.setState({
        minute:this.state.minute - 1,
        second:this.state.second + 60
      }) 
    }
  }
  
  no(){
    console.log('开始', new Date().getTime())
    this.id = setInterval(this.start,1000)
  }
  
  end(){
    clearInterval(this.id)
  }
  
  render(){
    return(
      <div>
        <div id="container">
          {this.state.minute} : {this.state.second}
        </div>
        
        <button onClick={this.no}>
          start
        </button>
            
        <button onClick={this.end}>
          end
        </button>
      </div>   
    )
  }
}

ReactDOM.render(
  <Clock/>,
  document.getElementById("root")
)

{% endcodeblock %}

{% blockquote %}
CSS：
{% endblockquote %}

{% codeblock %}
#container{
  height:10em;
  width:10em;
  border: 1px solid grey;
  text-align:center;
  line-height:1000%;
  font-size:40px;
}

button{
  background-color:blue;
  color:white;
  height:40px;
  width:10em;
  margin-top:10px;
  margin-right:2px;
}

{% endcodeblock %}

{% blockquote %}
DOM：
{% endblockquote %}

{% codeblock %}
<div id="root">
<div>
{% endcodeblock %}


### 测试结果如下图所示：

![setInterval](setInterval.png "setInterval")

{% note warning %}
## 问题很明显
{% endnote %}

{% blockquote %}
<span class="sanks-keywords">(1)</span> 最明显的问题莫过于 setInterval 的使用。写一个定时任务，不少小伙伴第一反应想到的也是 setTimeout 和 setInterval 函数，但是它们真的足够精确吗？这就要从 JS 的任务队列及微任务队列（也有称 macrotask queue 和 microtask queue）说起了…
{% endblockquote %}

{% blockquote %}
我们言简意赅总结下：JS 主线程执行时有一个栈存储运行时的函数相关变量，遇到函数时会先入栈执行完后再出栈。当遇到 setTimeout setInterval requestAnimationFrame 以及 I/O 操作时，这些函数会立刻返回一个值（如 setInterval 返回一个 intervalID ）保证主线程继续执行，而异步操作则由浏览器的其它线程维护。
{% endblockquote %}

{% blockquote %}
当异步操作完成时，浏览器会将其回调函数插入主线程的任务队列中，当主线程执行完当前栈的逻辑后，才会依次执行任务队列中的任务。
{% endblockquote %}

{% blockquote %}
但是在每个任务之间，还有一个微任务队列的存在。在当前任务执行完后，将先执行微任务队列中的所有任务，例如 Promise process.nextTick 等操作。也就是说当 setInterval(fn, 1000) 等待 1 秒钟后，fn 函数会被插入任务队列中，但并不一定会立刻执行，还需要等待当前任务以及微任务队列中的所有任务执行完。长此以往，使用 setInterval 的计时器超时将越来越严重。
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">(2)</span> 有人不注意 setState的异步问题，这个异步会存在时间误差；直接用js选择器来操作DOM即可。
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">(3)</span> 网上还有人对React生命周期没有做研判，正确的做法应放在 componentDidMount 生命周期中；
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">(4)</span> 为了刷新页面，有的人把时间戳存储在cookie中，每隔一秒更新一次，完全没有必要，只需要存储最终倒计时结束的时间戳即可。
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">(5)</span> 有人会考虑计算浮点数的误差，其实完全没必要，只需要对时间戳操作即可，在倒计时跨越“整秒”这一时机时，秒数减1，误差可忽略的，不影响最终的相减结果
{% endblockquote %}

{% blockquote %}
<span class="sanks-keywords">(6)</span> 更细致的是，每行代码执行也需要时间，这个也可以忽略不计。
{% endblockquote %}

{% blockquote %}
基于以上的（1-3）描述存在的误差的原因，导致最终的倒计时会出现偏差，经过测试会大于1s，在我看来，已经是不可接受的误差了，如果在真实的代码环境下，可能会存在多个宏任务、微任务，误差会更大，对以后的代码扩展也是不利的。
{% endblockquote %}

{% note success %}
## 更好的更新策略
{% endnote %}

{% blockquote %}
用requestAnimationFrame来解决这一问题:
{% endblockquote %}

{% blockquote %}
requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。
{% endblockquote %}

{% blockquote %}
设置这个API的目的是为了让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。代码中使用这个API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘。
{% endblockquote %}

{% blockquote %}
requestAnimationFrame的优势，在于充分利用显示器的刷新机制，比较节省系统资源。显示器有固定的刷新频率（60Hz或75Hz），也就是说，每秒最多只能重绘60次或75次，大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms。requestAnimationFrame的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行页面重绘。此外，使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力。
{% endblockquote %}

{% blockquote %}
不过有一点需要注意，requestAnimationFrame是在主线程上完成。这意味着，如果主线程非常繁忙，requestAnimationFrame的动画效果会大打折扣。
{% endblockquote %}

{% blockquote %}
requestAnimationFrame使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。
{% endblockquote %}

{% blockquote %}
计时器一直是javascript动画的核心技术。而编写动画循环的关键是要知道延迟时间多长合适。一方面，循环间隔必须足够短，这样才能让不同的动画效果显得平滑流畅；另一方面，循环间隔还要足够长，这样才能确保浏览器有能力渲染产生的变化。
{% endblockquote %}

{% blockquote %}
而setTimeout和setInterval的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。
{% endblockquote %}

### requestAnimationFrame代码实践（React）

{% blockquote %}
网上好多代码示例，要么是局部代码段，要么是不可执行的代码，或执行起来报错，或没有根据使用的实际情况调用cancelAnimationFrame取消定时器，以减少主线程的性能消耗。
{% endblockquote %}

{% blockquote %}
本代码的核心思想是在规避其他会造成计时误差的前提下，存储时间戳的形式来进行计时操作的，一般执行60次。秒数会减1。如果正在倒计时，页面刷新不会重置。并且在页面“卸载”时或倒计时结束时，用cancelAnimationFrame取消定时器。经过自己反复测试，最后的误差在 [-10ms， 10ms]，大大缩减了计时误差。
{% endblockquote %}

### 具体测试结果见下图：

![requestAnimationFrame](requestAnimationFrame.png "requestAnimationFrame")

### 具体代码如下：

Countdown.tsx
{% codeblock %}
import * as React from 'react';
import * as Cookies from 'js-cookie';
import './coutdown.scss';

interface CountProps {
    onRefCount: any;
    seconds: number;
    retryFetchCode: Function; // 子组建向父组件传递参数的函数
}
interface CountState {
    endStamp: number;
    text: string;
    nodes: any;
}

let myReq: Function;
class CountDown extends React.Component<CountProps, CountState> {
    constructor(props: CountProps) {
        super(props);
        // 刷新页面时，先检查cookie中是否存在这个值，如果有，则读取这个值
        // 此处会出现两种情况，在打开多个标签页的情况，但是登录的还是同一个用户
        // 此时，不需要重新计时，需要从之前的节点计时，也就是说是最终的截止时间（cookie中存在的那个值）
        const spareTime = Cookies.get('countDeadline');
        // 当前的时间戳
        var currStamp = new Date().getTime();
        // 最终剩余的整秒数
        let spareSeconds;
        if (spareTime) {
            spareSeconds = Math.ceil((spareTime - currStamp) / 1000);
        } else {
            spareSeconds = 60;
        }
        this.state = {
            endStamp: spareTime || new Date().getTime() + this.props.seconds,
            text: '重新获取(' + spareSeconds + ')',
            nodes: []
        };
        // 将最终终点的时间戳存入到cookie中
        Cookies.set('countDeadline', this.state.endStamp);
    }
    render() {
        return (
            <span
                className="count-down-timer"
                onClick={() => this.props.retryFetchCode(this.state.text)}
            >
                {this.state.text}
            </span>
        );
    }

    componentDidMount() {
        //通过props接收父组件传来的方法
        this.props.onRefCount(this);
        this.setState(
            {
                nodes: document.querySelectorAll('.count-down-timer')[0]
            },
            () => {
                console.log('countdown start', new Date().getTime());
                this._CountDownLoop();
            }
        );
    }

    componentWillUnmount() {
        console.log('卸载');
        cancelAnimationFrame(myReq);
        // 清除cookie
        Cookies.remove('countDeadline');
    }

    /**
     * 重新计入倒计时
     */
    _retryCountDown() {
        this.setState(
            {
                endStamp: new Date().getTime() + this.props.seconds,
                text: '重新获取(60)',
                nodes: []
            },
            () => {
                // 更新最终终点的时间戳，存入到cookie中
                Cookies.set('countDeadline', this.state.endStamp);
                console.log('countdown restart', new Date().getTime());
                this._CountDownLoop();
            }
        );
    }

    /**
     * 倒计时循环
     * @private
     */
    _CountDownLoop() {
        var currStamp = new Date().getTime();
        let text = ''; // 显示的文本
        var isEnd = false;
        //如果结束时间戳减去当前时间时间戳小于等于0则设置倒计时结束标识为true
        if (this.state.endStamp - currStamp <= -1) {
            isEnd = true;
            text = '重发短信验证码';
        }
        //如果结束则调用结束回调
        if (isEnd === true) {
            console.log('countdown end', new Date().getTime());
            cancelAnimationFrame(myReq);
        } else {
            // console.log(Math.ceil((this.state.endStamp - currStamp) / 1000));
            let remaining = Math.ceil((this.state.endStamp - currStamp) / 1000);
            text = '重新获取(' + remaining + ')';
            var that = this;
            myReq = requestAnimationFrame(function() {
                that._CountDownLoop();
            });
        }
        const target = this.state.nodes;
        if (target) {
            target.innerHTML = text;
            this.setState({
                text: text
            });
        } else {
            cancelAnimationFrame(myReq);
        }
    }
}
export default CountDown;

{% endcodeblock %}

countdown.scss
{% codeblock %}
@import '../../scss/index';
.count-down-timer {
    display: inline-block;
}
{% endcodeblock %}

Verify.tsx
{% codeblock %}
import * as React from 'react';
import Button from '../../../node_modules/antd-mobile/es/button';
import '../../../node_modules/antd-mobile/es/button/style';
import { toParams, getQueryString } from '../../utils';
import { connect } from 'react-redux';
import { navigatorActions, userActions } from '../../redux/actions';
import { sendVerifyCode } from '../../api/sms';
import NavBar from '../../components/NavBar/NavBar';
import GlobalMessage from '../../components/GlobalMessage/GlobalMessage';
import * as lodash from 'awesome-utils-normal';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import CountDown from '../../components/CountDown/CountDown';
import './verify.scss';

interface Props extends React.Props<Props> {
    history: any;
    match: any;
    register: Function;
    form: any;
    title: string;
    verifyLogin: Function;
    changeNavbarStatus: Function;
    changeBackStatus: Function;
    changeFilterStatus: Function;
    changeTitle: Function;
    changeSidebarStatus: Function;
}

interface State {
    title: string;
    phone: string;
    verifyCode: string;
}

export class Verify extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '输入验证码',
            phone: '',
            verifyCode: ''
        };
    }

    // 验证码是否正确
    validateCode = () => {
        if (this.state.verifyCode.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    // 定义一个拿子组件返回值this的函数
    onRef = (ref: Object) => {
        this.child = ref;
    };

    onRefCount = (ref: Object) => {
        this.childCount = ref;
    };

    // 调用错误提示方法
    showError = (message: Object) => {
        this.child.showMessage(message);
    };

    // 调用重新倒计时的方法
    retryCountDown = () => {
        this.childCount._retryCountDown();
    };

    // 验证码登录
    onSignup = () => {
        const { match } = this.props;
        if (this.validateCode()) {
            const userInfo = {
                activity_id: getQueryString('from'),
                phone: this.state.phone,
                verifyCode: Number(this.state.verifyCode),
                grant_type: 'password',
                from: match.params.from
            };
            this.props.verifyLogin(toParams(userInfo));
        } else {
            this.showError({
                text: '请输入正确的验证码',
                type: 'message-error'
            });
        }
    };

    // 重新获取验证码
    retryFetchCode(text: string) {
        if (text === '重发短信验证码') {
            // 调用发送验证码的接口
            sendVerifyCode({
                phone: this.state.phone
            })
                .then((res: any) => {
                    console.log(res);
                })
                .catch((err: any) => {
                    console.log(err);
                });
            this.retryCountDown();
        }
    }

    getChildTextData(value: string) {
        if (!value) {
            return;
        }
        const tempArr = value.split('');
        const finalArr = tempArr.map(item => Number(item));
        this.setState({
            verifyCode: finalArr.join('')
        });
    }
    static getDerivedStateFromProps(props: any) {
        props.changeNavbarStatus(true);
        props.changeBackStatus(true);
        props.changeFilterStatus(false);
        props.changeTitle('');
        // this.props.changeSidebarStatus(false);
        const { match } = props;
        return {
            phone: match.params ? match.params.phone : ''
        };
    }

    render() {
        return (
            <div className="verify">
                <NavBar {...this.props} />
                <GlobalMessage onRef={this.onRef} _left="0" />
                <form className="verify-form">
                    <div className="header">
                        <h4
                            style={
                                this.state.title === '输入验证码' ? { paddingBottom: '32px' } : {}
                            }
                        >
                            {this.state.title}
                        </h4>
                        <span>
                            已发送4位验证码至 <i>+86 {this.state.phone}</i>
                        </span>
                    </div>
                    <div>
                        <PasswordInput
                            length={4}
                            mask={false}
                            gutter={4}
                            focused={true}
                            getChildTextData={this.getChildTextData.bind(this)}
                        />
                    </div>
                    <div className="btn-warpper">
                        <Button
                            type="primary"
                            className="verify-btn"
                            activeClassName="verify-btn-active"
                            /* loading={true} */
                            onClick={lodash.debounce({
                                fn: this.onSignup,
                                wait: 1000,
                                immediate: true
                            })}
                        >
                            确定
                        </Button>
                        <a className="text-link">
                            <CountDown
                                seconds={60000}
                                retryFetchCode={this.retryFetchCode.bind(this)}
                                onRefCount={this.onRefCount}
                            ></CountDown>
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}
function mapState(state: any) {
    const { signIning } = state.authentication;
    const { navbarStatus, backStatus, filterStatus, title, sidebarStatus } = state.navigator;
    return {
        signIning,
        navbarStatus,
        backStatus,
        filterStatus,
        title,
        sidebarStatus
    };
}

const actionCreators = {
    verifyLogin: userActions.verifyLogin,
    changeNavbarStatus: navigatorActions.changeNavbarStatus,
    changeBackStatus: navigatorActions.changeBackStatus,
    changeFilterStatus: navigatorActions.changeFilterStatus,
    changeTitle: navigatorActions.changeTitle,
    changeSidebarStatus: navigatorActions.changeSidebarStatus
};
export default connect(
    mapState,
    actionCreators
)(Verify);

{% endcodeblock %}

Verify.scss
{% codeblock %}
@import '../../scss/index';
.verify {
    position: relative;
    padding-top: 50px;
    box-sizing: border-box;
    z-index: 0;
    height: 100vh;
    background-color: $black;
    &-form {
        width: 80vw;
        background: transparent;
        overflow: hidden;
        margin: 0 auto;
        color: $font-color;
        .header {
            > h4 {
                margin: 0;
                padding: 0 0 16px;
                font-size: 24px;
                font-weight: 400;
            }
            > span {
                display: inline-block;
                padding-bottom: 32px;
                font-size: 14px;
                i {
                    font-style: normal;
                    opacity: 0.6;
                }
            }
        }
    }
    .btn-warpper {
        text-align: center;
    }
    &-btn {
        border-radius: 42px !important;
        margin-top: 20px;
        margin-bottom: 24px;
        opacity: 0.9;
        &-active {
            @extend .am-green-active;
        }
    }
}
{% endcodeblock %}

{% note primary %}
## 总结
{% endnote %}

{% blockquote %}
上面示例中我们可以看到，通过requestAnimationFrame不断的自己调用自己，实现高频度刷新倒计时，从而解决了页面切换窗口等传统setTimeout和setInterval假死问题。
{% endblockquote %}

{% blockquote %}
倒计时组件以及调用组件的父组件的完整代码在这了，其他关联性不大的组件代码没有粘贴在这。需要这个组件代码的朋友可以随取随用，如果对倒计时组件有优化意见，可以向我发邮件提出建议。
{% endblockquote %}