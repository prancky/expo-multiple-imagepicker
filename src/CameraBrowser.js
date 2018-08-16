import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  CameraRoll,
  FlatList,
  Dimensions,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { FileSystem,Camera,Permissions } from 'expo';
import ImageTile from './ImageTile';
const { width } = Dimensions.get('window')

export default class ImageBrowser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      flash: 'auto',
      zoom: 0,
      autoFocus: 'on',
      depth: 0,
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      selected: {},
      //photoId: 0,
      capturing:false,
      showGallery: false,
      photos: [],
      flashIcon:'flash-on'
    };
  };

  prepareCallback() {
    let { selected, photos } = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return(selected[index])
    });
    let files = selectedPhotos
      .map(i => FileSystem.getInfoAsync(i, {md5: true}))
    let callbackResult = Promise
      .all(files)
      .then(imageData=> {
        return imageData.map((data, i) => {
          return {file: selectedPhotos[i], ...data}
        })
      })
    this.props.callback(callbackResult)
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _snap = async () => {
    if (this.refs.theCamera) {
      //Vibration.vibrate();
      let result = await this.refs.theCamera.takePictureAsync();
      if (!result.cancelled) {
        var photoList = this.state.photos
        photoList.push(result.uri)
        this.setState({
          photos: photoList,
          //capturing:false
        });
        this.selectImage(photoList.length - 1);
      }

    }
  }

  renderImageTile(data){
    return data.map((item, index) =>{
      let selected = this.state.selected[index] ? true : false
      return(
        <ImageTile
          key={index}
          item={item}
          index={index}
          selected={selected}
          camera={true}
          selectImage={this.selectImage}
        />
      )
    });
  }

  selectImage = (index) => {
     let newSelected = {...this.state.selected};
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true
    }
    if (Object.keys(newSelected).length > this.props.max) return;
    if (!newSelected) newSelected = {};
     this.setState({ selected: newSelected })
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref="theCamera"
            style={{ flex: 1 }}
            type={this.state.type}
            flashMode={this.state.flash}
            >

            <View style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  alignItems: 'flex-start',
                }}
                onPress={() => {
                  this.props.callback(Promise.resolve([]))
                }}>
                <Image
                  style={{margin: 15}}
                  source={require('../Assets/cam-close.png')}
                />
              </TouchableOpacity>
              {this.state.selected  && <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  alignItems: 'flex-end',
                }}
                onPress={() => {
                  this.prepareCallback()
                }}>
                <Image
                  style={{margin: 15}}
                  source={require('../Assets/done.png')}
                />
              </TouchableOpacity>}
              </View>
              {/*this.state.capturing && <ActivityIndicator size="large" />*/}
            {this.state.photos &&  <View style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'center'
            }} >
              <ScrollView
                horizontal={true} >
               {this.renderImageTile(this.state.photos)}
              </ScrollView>
            </View>}


            <View
              style={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              {/*<TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>*/}
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this._snap();
                  //this.setState({capturing:true});
                }}>
                  <Image
                    style={{marginVertical: 10}}
                    source={require('../Assets/border.png')}
                  />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20
  },
})
