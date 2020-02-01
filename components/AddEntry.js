import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue, clearLocalNotification, setLocalNotification } from '../utiles/helpers'
import UdaceSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utiles/api';
import { connect } from "react-redux";
import { addEntry } from '../actions'
import { white, purple } from '../utiles/colors'
import { NavigationActions } from 'react-navigation'

function SubmitBtn({onPress}) {
    return(
        <TouchableOpacity
        style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
        onPress={onPress}>
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
    )
}

 class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }
    
    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] - step

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state

        // update Redux
        this.props.dispatch(addEntry({
            [key]: entry
        }))
        
        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))
        // Rout to Home
        this.toHome()
        
        // save to 'DB'
        submitEntry({ key, entry })
        // clear Notification

        clearLocalNotification()
            .then(setLocalNotification)
    }

    reset = () => {
        const key = timeToString()

        // Update Redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))
        // Route to Home
        this.toHome()

        // Update 'DB'
        removeEntry(key)
    }

    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({
            key: 'AddEntry'
        }))
    }

    render() {
        const metaInfo = getMetricMetaInfo()
        
        if(this.props.alreadyLogged) {
            return(
                <View style={styles.center}>
                    <Ionicons 
                        name={Platform.OS === 'ios' ? 'ios-happy' : "md-happy"}
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton style={{padding: 10}} onPress={this.reset} >
                        Reset
                    </TextButton>
                </View>
            )
        }
        return(
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()} />
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest } = metaInfo[key]
                   const value = this.state[key]

                   return (
                       <View key={key} style={styles.row}>
                        {getIcon()}
                        {type === 'slider'
                            ? <UdaceSlider 
                                value={value}
                                onChange={(value) => this.slide(key, value)}
                                {...rest}
                            />
                            : <UdaciStepper 
                                value={value}
                                onIncrement={() => this.increment(key)}
                                onDecrement={() => this.decrement(key)}
                                {...rest}
                            />
                        }
                       </View>
                   )
               })}
               <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 10,
        backgroundColor: white,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
        marginLeft: 30,
    }
})

function mapStateToProps (state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}
export default connect(mapStateToProps)(AddEntry)