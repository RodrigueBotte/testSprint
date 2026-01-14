import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../service/api";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

interface TaskProp {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<TaskProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dailyTasks, setDailyTasks] = useState<TaskProp[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get("/task/api/tasks/json");
      setTasks(response.data);
      const marks: { [key: string]: any } = {};
      response.data.forEach((task: TaskProp) => {
        const dataStr = new Date(task.createdAt).toISOString().split("T")[0];
        if (!marks[dataStr]) {
          marks[dataStr] = { marked: true, dotColor: "blue" };
        }
      });
      setMarkedDates(marks);
    } catch (error) {
      Alert.alert("Erreur lors du changement des données.");
    } finally {
      setLoading(false);
    }
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const filtered = tasks.filter(
      (task) =>
        new Date(task.createdAt).toISOString().split("T")[0] === day.dateString
    );
    setDailyTasks(filtered);
    setModalVisible(true);
  };

  const downloadCsv = async () => {
    try {
      const response = await apiClient.get("/task/api/tasks/csv", {
        responseType: "blob",
      });
      if (Platform.OS === "web") {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "tasks.csv";
        link.click();
        window.URL.revokeObjectURL(url);
        window.alert("Csv téléchargé avec succés!");
      } else {
        // Téléchargement pour la version mobile à faire.
      }
    } catch (error) {
      Alert.alert("Erreur lors du téléchargement.");
    }
  };

  const addTask = async () => {
    try {
      await apiClient.post("/task/new", {
        title: newTaskTitle,
        description: newTaskDesc,
        createdAt: `${selectedDate}T10:00:00Z`, // Heure par défaut
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setModalVisible(false);
      fetchTasks(); // Refresh
      Alert.alert("Tâche ajoutée !");
    } catch (error) {
      Alert.alert("Erreur ajout tâche.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <Text>Chargement...</Text>;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType="dot"
          theme={{
            selectedDayBackgroundColor: "#009688",
            todayTextColor: "#009688",
          }}
        />
        <Text style={styles.dateTitle}>
          {selectedDate ? `Tâches du ${selectedDate}` : "Sélectionne un jour"}
        </Text>
        <FlatList
          data={dailyTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Aucune tâche ce jour</Text>}
        />
        <Modal visible={modalVisible} animationType="slide">
          <ScrollView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Nouvelle tâche le {selectedDate}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={addTask}>
                <Text style={styles.addBtnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    width: "50%",
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: "#f8f9fa",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    alignItems: "center",
    marginRight: 10,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#009688",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
