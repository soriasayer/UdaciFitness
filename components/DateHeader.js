import React from 'react'
import { Text } from 'react-native'
import { purple } from '../utiles/colors'

export default function DateHeader ({ date }) {
    return (
        <Text style={{color: purple, fontSize: 22}}>
            {date}
        </Text>
    )
}