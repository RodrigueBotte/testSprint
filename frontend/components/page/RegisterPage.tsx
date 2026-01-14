import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import apiClient from "../service/api";
import { navigate } from "expo-router/build/global-state/routing";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const handleRegister = async()=>{
        if (!email || !password || !confirmPassword) {
            Alert.alert('L\'email, le mote de passe et le confirmation du mot de passe sont requis');
        }

        if (password !== confirmPassword) {
            Alert.alert('Le mot de passe et sa confirmation ne sont pas identiques.');
        }

        setLoading(true);

        try {
            const response = await apiClient.post("/api/register",{
                email,
                password
            })
            console.log('Inscription réussi');
            navigate('/login');
            
        } catch (error) {
            return Alert.alert('Erreur lors de l\'inscription');
        } finally{
            setLoading(false)
        }
    }

    return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.container}>
                    <Text style={styles.title}>Inscription</Text>
                    <View style={styles.inputDetail}>
                        <Text style={styles.subTitle}>Email</Text>
                        <TextInput 
                            placeholder="Email"
                            onChangeText={setEmail}
                            value={email}
                            style={styles.inputStyle}
                        />
                    </View>
                    <View style={styles.inputDetail}>
                        <Text style={styles.subTitle}>Mot de passe</Text>
                        <TextInput 
                            placeholder="Mot de passe"
                            onChangeText={setPassword}
                            value={password}
                            style={styles.inputStyle}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputDetail}>
                        <Text style={styles.subTitle}>Confirmer le mot de passe</Text>
                        <TextInput 
                            placeholder="Confirmer le mot de passe"
                            onChangeText={setConfirmPassword}
                            value={password}
                            style={styles.inputStyle}
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity style={styles.btnSubmit} onPress={handleRegister}>
                        <Text style={{color: '#000000', fontWeight: 'bold'}}>
                            {loading ? 'Inscription...':'S\'inscrire' }
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
    
    const styles = StyleSheet.create({
        container:{
            borderWidth: 3,
            padding: 50,
            borderRadius: 15,
            borderColor: '#57c7e9',
            backgroundColor: '#fff',
            alignItems: 'center',
            gap: 15
        },
        title:{
            fontSize: 25,
            fontWeight: 'bold',
            textDecorationLine: 'underline'
        },
        subTitle:{
            fontSize: 15,
            fontWeight: 500
        },
        inputDetail:{
            gap: 10
        },
        inputStyle:{
            padding: 15,
            backgroundColor: '#ebebeb',
            borderRadius: 10,
            fontSize: 12.5
        },
        btnSubmit:{
            backgroundColor: '#57c7e9',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10
        }
    })