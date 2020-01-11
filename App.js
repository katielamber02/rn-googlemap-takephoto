/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });



//MAP AND LOCATION ANIMATION

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Dimensions,Button,Image} from 'react-native';
import MapView from 'react-native-maps';
import myImage from './assets/cat.png'
import ImagePicker from 'react-native-image-picker'

export default class App extends Component {
  state={
    focusedLocation:{
      latitude:37.7900352,
      longitude:-122.4013726,
      latitudeDelta:0.0122,
      longitudeDelta:Dimensions.get("window").width/Dimensions.get("window").height*0.0122
    
    },
    locationChosen:false,
    pickedImage:myImage
    
}
pickLocationHandler=event=>{
   const coords=event.nativeEvent.coordinate
   this.map.animateToRegion({
     ...this.state.focusedLocation,
     latitude:coords.latitude,
     longitude:coords.longitude
   })
   this.setState((prevState)=>{
     return {
      focusedLocation:{
        ...prevState.focusedLocation,
        latitude:coords.latitude,
        longitude:coords.longitude
 
      },
      locationChosen:true
     }
   })
}
getLocationHandler=()=>{
  navigator.geolocation.getCurrentPosition(pos=>{
     const coordsEvent={
       nativeEvent:{
         coordinate:{
           latitude:pos.coords.latitude,
           longitude:pos.coords.longitude
         }
       }
     }
     this.pickLocationHandler(coordsEvent)
  },
  err=>{
    console.log(err)
    alert('Fetching the position failed,please pick one manually')
  })
}

pickImageHandler=()=>{
  //showImagePicker
  ImagePicker.showImagePicker({title:'Pick an Image'},res=>{
    if(res.didCancel){
      console.log('User cancelled!')
    }else if(res.err){
      console.log('Error',res.error)
    }else{
      this.setState({
        pickedImage:{uri:res.uri,base64:res.data}
      })
    }
  })
}


  render() {
    let marker=null
    if(this.state.locationChosen){
      marker=<MapView.Marker coordinate={this.state.focusedLocation}/>
    }
    // blue marker:getLocationHandler
    // red marker:showsUserLocation={true} with permission
    return (
      <View style={styles.container}>
        <Image source={this.state.pickedImage} style={styles.image}/>
      <Button title="Pick image" onPress={this.pickImageHandler}/>
     

        <MapView 
            initialRegion={this.state.focusedLocation}
            // region={this.state.focusedLocation}
            style={styles.map}
            onPress={this.pickLocationHandler}
            ref={ref=>this.map=ref}
            showsUserLocation={true}
        >{marker}</MapView>
        <Button title="Show my location" onPress={this.getLocationHandler}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
 
  map:{
    width:"100%",
    height:250
  },
  image:{
    width:"70%",
    height:350
  }
});