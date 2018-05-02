import React, { Component } from 'react'
import { RNCamera } from 'react-native-camera'
import { ImageColorPicker } from 'react-native-image-color-picker'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      rendering: true,
      imageUri: 'https://dummyimage.com/100x100',
      colors: []
    }
  }

  render () {
    let palettesView = []
    if (this.state.colors.length > 0) {
      palettesView = this.state.colors.map(color => (
        <View
          key={`color-${Math.random()}`}
          style={{
            backgroundColor: color,
            width: 25,
            height: 25,
            marginBottom: 2
          }}
        />
      ))
    }

    return (
      <View style={styles.container}>
        { this.state.rendering
          ? <ImageColorPicker
            style={styles.ImageRender}
            paletteCount={5}
            colorType={'hex'}
            imageUrl={this.state.imageUri}
            pickerCallback={this.pickerCallback.bind(this)}
          />
          : null
        }

        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
        />

        <View style={styles.palates}>
          { this.state.colors.length > 0 && palettesView }
        </View>

        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.captureButton}
          >
            <Text style={{fontSize: 14}}> GET COLORS </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  pickerCallback (message) {
    if (message && message.nativeEvent && message.nativeEvent.data) {
      const colors = JSON.parse(message.nativeEvent.data).payload
      console.log({colors})
      this.setState({colors, rendering: false})
    }
  }

  async takePicture () {
    if (this.camera) {
      const options = { quality: 0.5 }
      const {uri} = await this.camera.takePictureAsync(options)
      console.log(`image uri: ${uri}`)
      this.setState({imageUri: uri, rendering: true})
    } else {
      throw new Error('no camera')
    }
  };
}

const styles = StyleSheet.create({
  ImageRender: {},
  palates: {
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
})
