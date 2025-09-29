import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SidePanel from "../components/SidePanel"
import TopBar from "../components/TopBar"

const history = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <View style={styles.screen}>
      <TopBar title="History" onPressProfile={() => setOpen(true)} />
      <View style={{ padding: 16 }}>
        <Text>history</Text>
      </View>
      <SidePanel visible={open} onClose={() => setOpen(false)} />
    </View>
  )
}

export default history

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FCFCFC' }
})