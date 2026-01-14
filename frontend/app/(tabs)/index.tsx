import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center', gap: 35 }}>
          <Text style={styles.title}>
            Bienvenue sur l&apos;application !
          </Text>
          <Link href='/login' style={styles.btnLogin}>
            <Text style={styles.subTitle}>Se connecter</Text>
          </Link>
          <Link href='/register'>
            <Text  style={styles.textRegister}>Pas de compte? inscrivez vous ici!</Text>
          </Link>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title:{
    fontSize:25
  },
  btnLogin:{
    padding: 20,
    backgroundColor: "#33a8df",
    borderRadius: 15,
  },
  subTitle:{
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  textRegister:{
    color: "#000",
    fontWeight: 500
  }
});
