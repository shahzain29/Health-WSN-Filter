import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ActivityProcessor } from '../../Functions/activityProcessor'

const CheckProcess = () => {

  const navigation = useNavigation()

  


  return (
    <View>

      <Text> index </Text>
      <TouchableOpacity style={styles.buttonStyle} onPress={()=>{navigation.goBack()}}>
        <Text>GO BACK</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.buttonStyle} onPress={ActivityProcessor()}>
        <Text>check Activity</Text>
        </TouchableOpacity>
    </View>
  );
}


export default CheckProcess;


const styles = StyleSheet.create({
  buttonStyle:{
    borderWidth:1,
    margin:20,
    borderWidth:1
  }
})
