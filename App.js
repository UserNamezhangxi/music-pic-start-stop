/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View,Animated,Easing,Dimensions,TouchableOpacity} from 'react-native';
const {width,height} = Dimensions.get('window');
export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rotateValue: new Animated.Value(0),  //旋转
			btnStatus:'播放'
		};
		this.isPause = false;
		this.mAnimate = Animated.timing(this.state.rotateValue, {
			toValue: 1,
			duration: 30000,
			easing: Easing.inOut(Easing.linear),
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Animated.Image ref='mAnimate'  source={require("./timg.jpg")} style={
					{
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

        <TouchableOpacity
          style={{backgroundColor:'#9ed048',marginTop:30,margin:14,paddingLeft:40,paddingRight:40}}
          onPress={()=>{this.isPause ? this.pauseAnim() : this.startAnim()}}>
          <Text style={{fontSize:24}}>{this.state.btnStatus}</Text>
        </TouchableOpacity>
			</View>
		);
	}

	componentDidMount(){
		this.startAnim()
  }

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
