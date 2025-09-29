import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SidePanel from "../components/SidePanel"
import TopBar from "../components/TopBar"

const profile = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <View style={styles.screen}>
      <TopBar title="Profile" onPressProfile={() => setOpen(true)} />
      <View style={{ padding: 16 }}>
        <Text>profile</Text>
      </View>
      <SidePanel visible={open} onClose={() => setOpen(false)} />
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FCFCFC' }
})