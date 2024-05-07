import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ActivityProcessor } from '../../Functions/activityProcessor'
import ordonezAconverted from '../../Dataset/ordonezAconverted.json'
import ordonezBconverted from '../../Dataset/ordonezBconverted.json'
import AsyncStorage from '@react-native-async-storage/async-storage'


const CheckProcess = () => {

  const navigation = useNavigation()

  const activity = ordonezBconverted

  const [medicalInfo, setMedicalInfo] = useState()
  const [vitals, setVitals] = useState()

  let latestVitals

  useEffect(() => {
    getMedicalInfo()
    getVitals()
  }, [])

  useEffect(() => {

    console.log('vitals => ', medicalInfo?.disease)
    latestVitals = getHeartRateValueTimeDIff()
    processInitializer()
  }, [vitals])

  const getMedicalInfo = async () => {
    try {
      const results = await AsyncStorage.getItem('medicalInfo')
      console.log('getMedicalInfo Success', results)
      setMedicalInfo(JSON.parse(results))

    } catch (error) {
      console.log('getMedicalInfo Error =>', error)
    }
  }

  const getVitals = async () => {
    try {
      const results = await AsyncStorage.getItem('heartRate')
      console.log('getVitals Success ', results)
      setVitals(JSON.parse(results))
    } catch (error) {
      console.log('getVitals Error => ', error)
    }
  }

  const getHeartRateValueTimeDIff = () => {
    var now = new Date()
    const lastHeartRate = new Date(vitals?.endDate).getTime()


    let seconds = Math.round(Math.abs(now - lastHeartRate) / 1000);
    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    console.log('Diff=> ', hours, minutes, seconds)

    let isLatest = (hours == 0 && (minutes == 0 || (minutes > 0 && minutes < 10)))
    console.log('latest=>', isLatest)
    return isLatest

  }

  const processInitializer = () => {
    processActivity(activity)

    for (let i = 0; i < activity.length; i++) {
      if (activity[i].type === 'abnormal') {
        processActivity(activity[i])
      }
    }
  }

  const processActivity = (actions) => {
    if (latestVitals) {
      if (medicalInfo?.disease === 'heart' &&
        (actions.activityType === 'sleeping' || actions.activityType === 'Toileting' || actions.activityType === 'Spare_Time/TV')) {
        mergeData({ disease: medicalInfo?.disease, heartRate: vitals?.value, startTime: actions?.start, variationRange: 15 })
      } else if (medicalInfo?.disease === 'hypertension' &&
        (actions.activityType === 'sleeping' || actions.activityType === 'Toileting' || actions.activityType === 'Spare_Time/TV')) {
        mergeData({ disease: medicalInfo?.disease, distolic: vitals?.value?.distolic, systolic: vitals?.value?.systolic, startTime: actions?.start, systolicRange: 140, distolicRange: 90 })
      } else if (medicalInfo?.disease === 'diabetes' && actions.activityType === 'Toileting') {
        console.log('Normal Activity')
      } else if (medicalInfo?.disease === 'diabetes' && actions.activityType !== 'Toileting') {
        mergeData({ disease: medicalInfo?.disease, heartRate: vitals?.value, startTime: actions?.start, variationRange: 15 })
      }
    } else {
      if ((actions?.activityType === 'Sleeping' || actions?.activityType === 'Sleeping') && (medicalInfo?.disease === 'heart' || medicalInfo?.disease === 'diabetes' || medicalInfo?.disease === 'hypertension')) {
        console.log('inform Caregiver for abnormality and No sensor connection')
      } else if (actions?.activityType === 'Toileting' && medicalInfo?.disease !== 'diabetes') {
        console.log('inform Caregiver for abnormality and No sensor connection')
      } else {
        console.log('Normal Activity')
      }
    }
  }

  const mergeData = (data) => {
    console.log(data)
  }

  return (
    <View>

      <Text> index </Text>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => { navigation.goBack() }}>
        <Text>GO BACK</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.buttonStyle} onPress={() => printResults()}>
        <Text>check Activity</Text>
      </TouchableOpacity>
    </View>
  );
}


export default CheckProcess;


const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    margin: 20,
    borderWidth: 1
  }
})
