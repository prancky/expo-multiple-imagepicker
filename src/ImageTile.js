import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
const { width,height } = Dimensions.get('window')

class ImageTile extends React.PureComponent {
  render() {
    let { item, index, selected, selectImage,camera } = this.props;
    if (!item) return null;
    return (
      <TouchableHighlight
        style={[camera ? styles.imageSlider :'', {opacity: selected ? 0.8 : 1}]}
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >

        {this.props.camera ? <View style={{position: 'relative'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
            <Image
              style={{width: width/6, height: width/6, marginRight: 3}}
              source={{uri: item}}
            />
            {selected && <Image
              style={{position: 'absolute', left: 'auto', top: 'auto', marginLeft: 'auto'}}
              source={require('../Assets/tick-2.png')}
            />}
          </View>
        </View> : <View style={{position: 'relative'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
            <Image
              style={{width: width/4, height: width/4}}
              source={{uri: item}}
            />
            {selected && <Image
              style={{position: 'absolute', left: 'auto', top: 'auto', marginLeft: 'auto'}}
              source={require('../Assets/tick-2.png')}
            />}
          </View>
        </View> }


      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  imageSlider:{
    alignSelf: 'flex-end',
    overflow: 'scroll'
  },
})

export default ImageTile;
