## 模拟音乐播放器专辑图片动效控制 ##

首先我们需要定义一个旋转动画，按照常规实现，定义一个旋转动画

    constructor(props) {
		super(props);
		this.state = {
			rotateValue: new Animated.Value(0),  //旋转
			btnStatus:'播放'  //播放控制按钮
		};
		this.isPause = false; //是否暂停
		this.mAnimate = Animated.timing(this.state.rotateValue, {
			toValue: 1,
			duration: 30000, //30s 旋转一次
			easing: Easing.inOut(Easing.linear),
		});
	}
 
在`render`方法里面渲染动画
	
	<Animated.Image ref='mAnimate'  source={require("./timg.jpg")} style={{
            width:width/2,
            height:width/2,
            borderRadius:width/4,
				transform: [{
				  rotate: this.state.rotateValue.interpolate({ // 旋转，使用插值函数做值映射
						inputRange: [0, 1],
						outputRange: ['0deg', '360deg'],
					})
				}],
			}
		}/>

同时添加一个控制按钮：

	<TouchableOpacity
	  style={{backgroundColor:'#9ed048',marginTop:30,margin:14,paddingLeft:40,paddingRight:40}}
	  onPress={()=>{this.isPause ? this.pauseAnim() : this.startAnim()}}>
	  <Text style={{fontSize:24}}>{this.state.btnStatus}</Text>
	</TouchableOpacity>



现在我们为按钮的点击控制实现效果，启动效果：

	//重复动画
	_imgStarting = () => {
		if (this.isPause) {
			this.state.rotateValue.setValue(0);
			this.mAnimate.start(() => {
				this._imgStarting()
			})
		}
	};

	startAnim(){
	  if (this.isPause){ //避免多次点击启动多次动画出现异常.
	    return
      }
	  this.isPause = true;
	  this.setState({
	  	btnStatus:'pause'
      })
	  this.mAnimate.start(() => {
		this.mAnimate = Animated.timing(this.state.rotateValue, {
			toValue: 1,
			duration: 30000,
			easing: Easing.inOut(Easing.linear),
		});
		this._imgStarting()
	  })
    }

暂停控制效果：

	pauseAnim(){
		if (!this.isPause){   //避免多次点击启动多次动画出现异常.
			return
		}
		this.isPause = false;
		this.setState({
			btnStatus:'start'
		})
		this.state.rotateValue.stopAnimation((oneTimeRotate) => {
			//计算角度比例
			this.mAnimate = Animated.timing(this.state.rotateValue, {
				toValue: 1,
				duration: (1 - oneTimeRotate) * 30000,
				easing: Easing.inOut(Easing.linear),
			});
		});
  	}

注意，在最后实现暂停的时候计算了暂停的角度。

### 实现效果 ###

![实现效果](https://i.imgur.com/0HqPteD.gif)