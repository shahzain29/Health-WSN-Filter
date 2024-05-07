import React, { useEffect, } from 'react';
import {

  StyleSheet,
  SafeAreaView,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainNavigator from './src/Navigation/mainNavigator'

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health'

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const permissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.OxygenSaturation,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
      ],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    }
  }

  const options = {
    unit: 'bpm',
    startDate: new Date(2024, 2, 1).toISOString(),
    limit: 1,
  }
  const stepOptions = {
    startDate: "2024-04-06T02:10:00.000+0100",
    endDate: "2024-04-06T02:15:00.000+0100",
  }

  AppleHealthKit.initHealthKit(permissions, (error) => {
    if (error) {
      console.log('[ERROR] Cannot grant permissions!')
    }
  })

  useEffect(() => {
    new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
      'healthKit:HeartRate:new',
      async () => {
        getHealthValues('emitter')
      },
    );
  }, [])

  useEffect(() => {
    setInterval(() => {
      getHealthValues('interval')
    }, 5000)
  }, [])



  const getHealthValues = async (type) => {

    AppleHealthKit.getHeartRateSamples(
      options,
      (callbackError, results) => {
        if (callbackError) {
          console.log('Error')
          return
        }
        // console.log(`heartrate from ${type} => `, results)
        storeHeartRate(results[0], 'heartRate')
      },
    )
    AppleHealthKit.getRestingHeartRateSamples(
      options,
      (callbackError, results) => {
        if (callbackError) {
          console.log('Error')
          return
        }

        // console.log(`resting heart rate from ${type} => `, results)
        if (results[0]?.value) {
          storeHeartRate([{ value: results[0]?.value, endDate: results[0]?.endDate }], "restingHeartRate")
        }
      },
    )
    AppleHealthKit.getStepCount(
      stepOptions,
      (callbackError, results) => {
        if (callbackError) {
          console.log('Error ', callbackError)
          return
        }

        // console.log(`step count from ${type} => `, results)
        if (results?.value) {
          storeHeartRate(results.value, 'steps')
        }
      },
    )

    AppleHealthKit.getBloodPressureSamples(
      options,
      (callbackError, results) => {
        if (callbackError) {
          console.log('Error ', callbackError)
          return
        }

        // console.log(`blood Pressure from ${type} => `, results)
        if (results[0]?.value) {
          storeHeartRate(results[0], 'bloodPressure')
        }
      },
    )
  }

  const storeHeartRate = async (value, key) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
      // console.log('storeHeartRate success')
    } catch (error) {
      console.log('storeHeartRate Error =>', error)
    }
  }



  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textHeading: {
    fontSize: 32,
    fontWeight: 'bold',
  }
});

export default App;
