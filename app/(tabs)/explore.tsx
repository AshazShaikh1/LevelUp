import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SidePanel from "../components/SidePanel"
import TopBar from "../components/TopBar"

const explore = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <View style={styles.screen}>
      <TopBar title="Explore" onPressProfile={() => setOpen(true)} />
      <View style={{ padding: 16 }}>
        <Text>explore</Text>
      </View>
      <SidePanel visible={open} onClose={() => setOpen(false)} />
    </View>
  )
}

export default explore

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FCFCFC' }
})