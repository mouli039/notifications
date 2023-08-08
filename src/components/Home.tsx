import {Component} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, check, request} from 'react-native-permissions';

interface Iprops {}

interface Istate {
  notifications: any;
}

class Home extends Component<Iprops, Istate> {
  state = {
    notifications: [],
  };

  async componentDidMount() {
    this.check();
    this.pushNotifications();
  }

  check = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result !== 'granted') {
        this.requestPermission();
      }
    } catch (e) {
      console.log(e);
    }
  };

  requestPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result !== 'granted') {
        Linking.openSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // newFunc = async () => {
  //   messaging().onMessage(async remoteMessage => {
  //     console.log(remoteMessage.notification?.title);
  //     console.log(remoteMessage.notification?.body);

  //     PushNotification.localNotification({
  //         title: remoteMessage.notification?.title, message: remoteMessage.notification?.body!
  //     });
  //     // this.setState({ data: [...this.state.data, { title: String(remoteMessage.notification?.title), body: String(remoteMessage.notification?.body) }] })
  //     // Alert.alert(`${remoteMessage.notification?.title} ${remoteMessage.notification?.body}`)
  // });
  // }

  pushNotifications = async () => {
    messaging().onNotificationOpenedApp((data: any) => {
      this.setState({
        notifications: [
          ...this.state.notifications,
          {
            title: data.notification.title,
            body: data.notification.body,
            image: data.notification?.android.imageUrl,
          },
        ],
      });
    });
    const msg: any = await messaging().getInitialNotification();
    if (msg) {
      this.setState({
        notifications: [
          ...this.state.notifications,
          {
            title: msg.notification.title,
            body: msg.notification.body,
            image: msg.notification?.android.imageUrl,
          },
        ],
      });
    }
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>Home</Text>
        {this.state.notifications.map((ele: any,ind:number) => (
          <Text key={ind} style={styles.msgs}>{" "}{ind+1}.{" "} {ele.body}</Text>
        ))}
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight:'600',
    textAlign: 'center',
    color:'black',
    marginBottom:20,
    marginTop:20
  },
  msgs:{
    paddingVertical:5
  }
});
