import { useState } from "react";
import apiClient from "@/components/service/api";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "expo-router/build/global-state/routing";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async() =>{
        if (!email || !password) {
            Alert.alert("Error", "Email et mot de passe sont requis.")
        }

        setLoading(true);

        try {
            const response = await apiClient.post("/api/login_check", {
                email,
                password
            });
            const token = response.data;
            await AsyncStorage.setItem("jwt_token", token);
            console.log('Connexion réussie');
            navigate('/');
        } catch (error) {
            return Alert.alert("Erreur", "Erreur lors de la connexion.");
        } finally{
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.container}>
                <Text style={styles.title}>Connexion</Text>
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
                <TouchableOpacity style={styles.btnSubmit} onPress={handleLogin}>
                    <Text style={{color: '#000000', fontWeight: 'bold'}}>
                        {loading ? 'Connexion...':'Se connecter' }
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
        fontSize: 17,
        fontWeight: 500
    },
    inputDetail:{
        gap: 10
    },
    inputStyle:{
        padding: 15,
        backgroundColor: '#ebebeb',
        borderRadius: 10
    },
    btnSubmit:{
        backgroundColor: '#57c7e9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    }
})