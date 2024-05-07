import React, { useEffect, useState } from 'react';
import ordonezAconverted from '../Dataset/ordonezAconverted.json'
import ordonezBconverted from '../Dataset/ordonezBconverted.json'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';


export function ActivityProcessor() {

    const navigation = useNavigation()

    const ordonezA = ordonezAconverted
    const ordonezB = ordonezBconverted

    const [medicalInfo, setMedicalInfo] = useState()
    const [heartRate, setHeartRate] = useState()
    const [restingHeartRate, setRestingHeartRate] = useState()
    let latestValues


    useEffect(() => {
        getmedicalInfo()

    }, [])

    useEffect(() => {
        console.log('medical info =>', medicalInfo)
        console.log('heartRate =>', restingHeartRate)
        latestValues = getHeartRateValueTimeDIff()

        Testing()


        // if (medicalInfo !== null) {
        // processActivity()
        // } else {
        //     alert('No medical info found!')
        //     navigation.goBack()
        // }
    }, [heartRate])


    let results = []
    const Testing = () => {
        for (let i = 0; i < ordonezB.length; i++) {
            if (ordonezB[i].type === 'abnormal')
                processActivity(ordonezB[i])
        }

        console.log('Activity Results =>', results)
        console.log('latestVAlues ', latestValues)
    }

    const processActivity = (ADL) => {
        let processedDecision = ''
        if (ADL.activityType === 'Sleeping') {
            processedDecision = sleepActivityProcessor()
        } else if (ADL.activityType === 'Toileting') {
            processedDecision = toiletActivityProcessor()
        } else if (ADL.activityType === 'Spare_Time/TV') {
            processedDecision = spareTimeProcessor()
        }
        if (processedDecision !== '') {

            results.push({
                action: processedDecision,
                activity: ADL.activityType,
                disease: medicalInfo?.disease,
                age: medicalInfo?.age,
                vitalsHeartRate: latestValues === true ? heartRate?.value : 'Heart Rate not available',
                vitalsRestingHeartRate: latestValues ? restingHeartRate?.value : 'Resting heart Rate not available',
                medicalHistoryRestingHeartRate: medicalInfo?.userRestingHeartRate,
                medicalHistoryMaxHeartRate: medicalInfo?.maxHeartRate,
                medicalHistoryMinHeartRate: medicalInfo?.minHeartRate
            })
        }
    }

    const getmedicalInfo = async () => {
        try {
            const result = await AsyncStorage.getItem('medicalInfo')
            // console.log('medical check=>',result)
            setMedicalInfo(JSON.parse(result))
            getHeartRate()
            console.log('getmedicalInfo success')
        } catch (error) {
            console.log('getmedicalInfo Error ', error)
        }

    }

    const getHeartRate = async () => {
        try {
            const [result, restingRate] = await AsyncStorage.multiGet(['heartRate', 'restingHeartRate'])
            // console.log('heart Result=>', result[1])
            const checkResting = JSON.parse(restingRate[1])

            setRestingHeartRate(checkResting[0])
            setHeartRate(JSON.parse(result[1]))
            // const checkREsting = JSON.parse(restingHeartRate)
            // console.log('checkREsting = >',checkREsting)
            console.log('getHeartRate success')

        } catch (error) {
            console.log('getHeartRate Error', error)
        }
    }



    const sleepActivityProcessor = () => {
        // console.log('medicalINfo=>', medicalInfo)

        if (medicalInfo?.disease === 'heart') {
            if (latestValues === true) {
                if (heartRate?.value > medicalInfo?.maxHeartRate || heartRate?.value < medicalInfo?.minHeartRate - 10 ||
                    (medicalInfo.userRestingHeartRate - 10 > restingHeartRate?.value || medicalInfo.userRestingHeartRate - 10 < restingHeartRate?.value)) {

                    return 'Emergency'
                } else {

                    return 'Normal'
                }
            } else {

                return 'Emergency'
            }
        } else if (medicalInfo?.disease === 'hypertension') {
            if (latestValues) {
                if (heartRate?.value > medicalInfo?.maxHeartRate) {

                    return 'Emergency'
                } else {

                    return 'Normal'
                }
            } else return 'Emergency'
        } else if (medicalInfo?.disease === 'diabetes') return "Normal"

    }

    const toiletActivityProcessor = () => {


        if (medicalInfo?.disease === 'heart' || medicalInfo?.disease === 'hypertension') {
            if (latestValues) {
                if (heartRate?.value >= medicalInfo?.maxHeartRate || heartRate?.value > medicalInfo.userRestingHeartRate?.value + 10) {

                    return 'Emergency'
                } else {

                    return 'Normal'
                }
            } else {

                return 'Emergency'
            }
        } else if (medicalInfo?.disease === 'diabetes') {

            return 'Normal'
        }
    }

    const spareTimeProcessor = () => {
        if (medicalInfo?.disease === 'heart' || medicalInfo?.disease === 'hypertension') {
            if (latestValues) {
                if (heartRate?.value >= medicalInfo?.maxHeartRate || heartRate?.value > restingHeartRate?.value+10) {

                    return 'Emergency'
                } else {

                    return 'Normal'
                }
            } else {

                return 'Emergency'
            }
        } else if (medicalInfo?.disease === 'diabetes') {

            return 'Normal'
        }
    }

    const getHeartRateValueTimeDIff = () => {
        var now = new Date()
        const lastHeartRate = new Date(heartRate?.endDate).getTime()

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


}

