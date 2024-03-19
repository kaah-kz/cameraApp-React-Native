import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

export default function App() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [photo, setPhoto] = useState(null);

  if (!permission) {
    // Carregamento das permissôes
    return <View/>;
  }

  if (!permission.granted) {
    // As permissões da câmera não foram concedidas
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center'}}>Precisamos de sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title='grant permission'/>
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function sharePhoto() {
    if (!photo) {
      alert('Tire uma foto antes de compartilhar.');
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(photo);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref => {setCameraRef(ref);}}>
        <View style={styles.rodape}>
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Entypo
              name="cw"
              size={24}
              color="white"/>
              <Text style={styles.text}>
                Flip Câmera
              </Text>
          </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if(cameraRef){
              let photo = await cameraRef.takePictureAsync();
              console.log('photo', photo);
              setPhoto(photo.uri);
            }}}>
              <Entypo
              name="camera"
              size={24}
              color="white"
              />
              <Text style={styles.text}>Tirar a foto</Text>
            </TouchableOpacity>
            {photo && <View>
              <TouchableOpacity
              style={styles.button}
              onPress={sharePhoto}>
                <Entypo
                  name="share"
                  size={24}
                  color="white"
                />
            <Text style={styles.text}>Compartilhar foto</Text>
            </TouchableOpacity>
              </View>}
          </View>
        </View>
      </Camera>
      {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 5,
    gap: 10,
  },

  button: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'left',
    gap: 20
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  rodape: {
    position: 'absolute',
    top: '80%',
    left: '30%',
    marginBottom: 35,

  },
});

