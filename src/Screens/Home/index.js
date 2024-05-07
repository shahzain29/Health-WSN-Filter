import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView,NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DropDown from '../../Components/dropDown';



const Home = () => {
  

  const [chronicDisease, setChronicDisease] = useState(null)
  const [chronicDiseaseType, setChronicDiseaseType] = useState(null)
  const [age,setAge] = useState(null)

  const navigation = useNavigation()

  const collectData = () => {

    if (chronicDisease === null || chronicDiseaseType === null) {
      alert('Please select the options')
      return
    }

    const medicalData = {
      disease: chronicDiseaseType,
      age:age
    }

    saveMedicalInfo(medicalData)
  }

  const saveMedicalInfo = async (value) => {
    try {
      await AsyncStorage.setItem('medicalInfo', JSON.stringify(value))
      console.log('saveMedicalInfo Success')
    } catch (error) {
      console.log('saveMedicalInfo Error', error)
    }
  }



  return (
    <ScrollView
      keyboardShouldPersistTaps='never'
      contentContainerStyle={styles.mainContainer}>

      <TouchableOpacity onPress={() => { navigation.navigate('CheckProcess') }}>
        <Text style={{ alignSelf: 'center' }}> Add Medical history</Text>
      </TouchableOpacity>

      <View style={styles.innerContainer}>
      <Text>
          Are you facing any chronic diseases?
        </Text>

      <TextInput
      style={{borderBottomWidth:1,padding:10,marginVertical:20,width:'90%',alignSelf:'center'}}
      placeholder='Age...'
      placeholderTextColor={'grey'}
      maxLength={2}
      onChangeText={(text)=>{setAge(parseInt(text))}}
      />
        <Text>
          Are you facing any chronic diseases?
        </Text>

        <DropDown
          data={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          placeholder={'Select Choice'}
          onChange={(item) => { setChronicDisease(item) }}
        />
        {chronicDisease ?
          <>

            <Text>
              Please select one of the following disease
            </Text>
            <DropDown
              data={[
                { label: 'Heart Condition', value: 'heart' },
                { label: 'Diabetes', value: 'diabetes' },
                { label: 'Hypertension', value: 'hypertension' },
                { label: 'Asthma', value: 'asthma' },
                // {label: 'High Blood Pressure',value: 'highBP'}
              ]}
              placeholder={'Select Choice'}
              onChange={(item) => { setChronicDiseaseType(item) }}
            />
          </>
          : null
        }
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={() => { collectData() }}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Home


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF'
  },
  innerContainer: {
    marginTop: '10%',
    flex: 0.8
  },
  minMaxInput: {
    height: 30,
    width: '20%',
    borderWidth: 0.5,
    padding: 5
  },
  submitButton: {
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#91E191',
    alignSelf: 'center',
    borderRadius: 10
  }

})