import React from 'react';
import { View, Platform } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import History from './components/History'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { puple, white, purple } from './utiles/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

const _TabNavigator = Platform.OS === 'ios' ? createBottomTabNavigator : createMaterialTopTabNavigator

const TabNavigator = _TabNavigator({
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor} />
    }
  }
},{
  navigationOptions: {
    header: null,
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        height: 0,
        width: 3,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
    }
  }
})

const NavTabs = createAppContainer(TabNavigator)

export default function App() {
  return (
    <Provider store={createStore(reducer)}>
      <View style={{flex: 1}} accessible >
        <View style={{height: 20}} />
        <NavTabs />
      </View>
    </Provider>
  );
}


