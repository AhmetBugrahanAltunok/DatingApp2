import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { collection, getDocs, setDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons'; // İkonları kullanmak için

const firebaseConfig = {
  apiKey: "AIzaSyCfE2QYJKPNvaaXDIxUlGQSLHSJez-V-No",
  authDomain: "dateapp-d0658.firebaseapp.com",
  projectId: "dateapp-d0658",
  storageBucket: "dateapp-d0658.appspot.com",
  messagingSenderId: "369307984656",
  appId: "1:369307984656:web:b76dae469dcb239b7bfb95"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MainPage = ({ navigation }) => {
  const currentUserId = auth.currentUser?.uid;
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interactions, setInteractions] = useState({});
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        const profilesData = userDocs.docs
          .filter(doc => doc.id !== currentUserId)
          .map(doc => ({ ...doc.data(), id: doc.id }));

        const interactionsSnapshot = await getDocs(query(collection(db, 'interactions'), where('likerId', '==', currentUserId)));
        const interactionsData = {};
        interactionsSnapshot.docs.forEach(doc => {
          interactionsData[doc.data().targetId] = doc.data().status;
        });

        const filteredProfiles = profilesData.filter(profile => !interactionsData[profile.id] || interactionsData[profile.id] !== 'dislike');
        setProfiles(filteredProfiles);
        setIsLoading(false);
        setInteractions(interactionsData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [currentUserId]);

  const handleLike = async (profileId) => {
    try {
      const interactionDocRef = doc(db, 'interactions', `${currentUserId}_${profileId}`);
      const interactionDoc = await getDoc(interactionDocRef);

      if (interactionDoc.exists()) {
        if (interactionDoc.data().status === 'like') {
          console.log('You already liked this profile.');
          return;
        } else {
          await setDoc(interactionDocRef, {
            likerId: currentUserId,
            targetId: profileId,
            status: 'like',
          }, { merge: true });
          console.log('Like status updated.');
        }
      } else {
        await setDoc(interactionDocRef, {
          likerId: currentUserId,
          targetId: profileId,
          status: 'like',
        });
        console.log('Profile liked.');
      }

      setInteractions({ ...interactions, [profileId]: 'like' });

      const likesQuery = query(
        collection(db, 'interactions'),
        where('likerId', '==', profileId),
        where('targetId', '==', currentUserId),
        where('status', '==', 'like')
      );

      const likesSnapshot = await getDocs(likesQuery);

      if (!likesSnapshot.empty) {
        console.log("It's a match!");

        const newConversationRef = doc(collection(db, 'conversations'));
        await setDoc(newConversationRef, {
          members: [currentUserId, profileId],
          lastMessage: '',
          lastMessageTime: new Date(),
        });

        navigation.navigate('ChatDetail', { conversationId: newConversationRef.id });
      }

      // Move to next profile
      handleScrollRight();

    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = async (profileId) => {
    try {
      const interactionDocRef = doc(db, 'interactions', `${currentUserId}_${profileId}`);
      const interactionDoc = await getDoc(interactionDocRef);

      if (interactionDoc.exists()) {
        if (interactionDoc.data().status === 'dislike') {
          console.log('You already disliked this profile.');
          return;
        } else {
          await setDoc(interactionDocRef, {
            likerId: currentUserId,
            targetId: profileId,
            status: 'dislike',
          }, { merge: true });
          console.log('Dislike status updated.');
        }
      } else {
        await setDoc(interactionDocRef, {
          likerId: currentUserId,
          targetId: profileId,
          status: 'dislike',
        });
        console.log('Profile disliked.');
      }

      setInteractions({ ...interactions, [profileId]: 'dislike' });

      // Move to next profile
      handleScrollRight();

    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const handleScrollLeft = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    setCurrentIndex(newIndex);
  };

  const handleScrollRight = () => {
    const newIndex = Math.min(currentIndex + 1, profiles.length - 1);
    flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    setCurrentIndex(newIndex);
  };

  const renderProfile = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.bio}>{item.bio}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.dislikeButton]} onPress={() => handleDislike(item.id)}>
          <Text style={styles.buttonText}>Beğenme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={() => handleLike(item.id)}>
          <Text style={styles.buttonText}>Beğen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#D30455" />
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            ref={flatListRef}
            data={profiles}
            renderItem={renderProfile}
            keyExtractor={item => item.id}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          />
          <View style={styles.arrowsContainer}>
            <TouchableOpacity onPress={handleScrollLeft}>
              <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleScrollRight}>
              <MaterialIcons name="arrow-forward" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => handleNavigation('Main')}>
          <Text style={styles.bottomBarButtonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => handleNavigation('Chat')}>
          <Text style={styles.bottomBarButtonText}>Sohbet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => handleNavigation('Profile')}>
          <Text style={styles.bottomBarButtonText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end', // İçeriği alta doğru hizalar
    marginBottom: 60, // Alt barın üzerine çıkmamak için
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20, // Okları biraz daha alta çekmek için eklendi
  },
  card: {
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width - 160,
    borderRadius: 10,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  dislikeButton: {
    backgroundColor: '#FF5733',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D30455',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarButton: {
    paddingVertical: 10,
  },
  bottomBarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  horizontalScroll: {
    alignItems: 'center',
  },
});

export default MainPage;
