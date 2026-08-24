import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  Alert 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ActionButton from '../components/ActionButton';

export default function ProfileScreen() {
  const [nome, setNome] = useState('João Desenvolvedor');
  const [bio, setBio] = useState('Entusiasta de React Native e apaixonado por UI/UX.');
  const [receberNotificacoes, setReceberNotificacoes] = useState(true);

  const salvarPerfil = () => {
    Alert.alert('Sucesso!', 'Os dados do seu perfil foram salvos.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Imagem de Capa e Avatar (Demonstrando o componente Image) */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.coverImage} 
        />
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }} 
            style={styles.avatar} 
          />
        </View>
      </View>

      {/* Formulário (Demonstrando TextInput e Views aninhadas) */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <Text style={styles.label}>Nome Completo</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#64748b"
          />
        </View>

        <Text style={styles.label}>Mini Biografia</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            multiline={true}
            numberOfLines={4}
            placeholder="Fale um pouco sobre você"
            placeholderTextColor="#64748b"
          />
        </View>

        {/* Interação com Switch */}
        <View style={styles.switchContainer}>
          <View>
            <Text style={styles.switchLabel}>Notificações Push</Text>
            <Text style={styles.switchSubLabel}>Receber alertas de novidades</Text>
          </View>
          <Switch 
            trackColor={{ false: '#334155', true: '#38bdf8' }}
            thumbColor={receberNotificacoes ? '#ffffff' : '#94a3b8'}
            onValueChange={setReceberNotificacoes}
            value={receberNotificacoes}
          />
        </View>

        {/* Botão Customizado (Demonstrando TouchableOpacity) */}
        <ActionButton 
          title="Salvar Alterações" 
          iconName="save" 
          onPress={salvarPerfil} 
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    top: 90,
    backgroundColor: '#0f172a',
    padding: 5,
    borderRadius: 65,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 30,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  switchSubLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  }
});