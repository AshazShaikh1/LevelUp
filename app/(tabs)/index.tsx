import React from 'react'
import { StyleSheet, View } from 'react-native'
import SidePanel from "../components/SidePanel"
import TopBar from "../components/TopBar"

const home = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <View style={styles.screen}>
      <TopBar onPressProfile={() => setOpen(true)} />

      {/* Content placeholder */}
      <View style={{ flex: 1 }} />

      <SidePanel visible={open} onClose={() => setOpen(false)} />
    </View>
  )
}

export default home

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FCFCFC'
  }
})