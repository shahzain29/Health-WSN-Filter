
import data from '../../Dataset/ordonezA.json'


export const processData = () => {
    var entries = []
    for (x of data) {
        parts = x.split('\t\t')
        var startTime = parts[0]
        var endTime = parts[1]
        var activity = parts[2]
        entries.push({ 'start': startTime, 'end': endTime, 'activityType': activity, type: 'normal' })
    }
    return entries
}