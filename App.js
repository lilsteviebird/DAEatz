import React, {Component} from 'react';
import {Platform, StyleSheet, View, SectionList, TouchableOpacity, AsyncStorage, TextInput, WebView, Dimensions, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { Container, Header, Left, Right, Content, Body, Text, Title, Subtitle, List, ListItem, Icon } from 'native-base';







let date = require('date-and-time');


type Props = {};

var addedFood=[];





export default class App extends Component<Props> {




FirstRoute (){



  return(
      <View>

    <Header style = {{backgroundColor: '#ffffff'}}>
          <Left />
          <Body style = {{backgroundColor: '#ffffff'}}>
            <Title>DA EATZ</Title>
            
          </Body>
          <Right />
        </Header>





        <FlatList
        style={{marginBottom: 70}}
        data={this.state.fetchedData}
        renderItem={ ({ item }) => {
    if (item.header) {
      return (
        <ListItem itemDivider>
         
            <Text style = {{fontFamily: 'helvetica', fontWeight: 'bold', paddingRight: 10,}}>
              {item.name}
            </Text>
             <Icon ios='ios-arrow-dropdown' android ='md-arrow-dropdown' style={{fontSize: 15}}/>
          
          <Right />
        </ListItem>
      );
    } else if (!item.header) {
      return (

        <TouchableOpacity>

        <ListItem style={{ flex: 1, flexDirection: 'column'}} onPress={this.alertedMessage.bind(this, item)}>
          
            <Text style={{flexDirection:'row', fontFamily: 'helvetica', alignSelf:'flex-start'}} >{item.name}</Text>
         
            <View style={{alignSelf: 'flex-end'}}>
              <Icon ios ='ios-add-circle-outline' android = 'md-add-circle-outline' style={{fontSize: 22, alignSelf:'flex-end'}}/> 
              </View>
            <Subtitle style = {{alignSelf: 'flex-start'}}>{item.cal} calories</Subtitle>
            </ListItem>
            </TouchableOpacity>

        
      );
    }
  }}
        keyExtractor={item => item.name}
        stickyHeaderIndices={this.state.stickyHeaderIndices}
      />



      </View>


    )

}








SecondRoute () {



  return(



    <View style={{ marginTop : (Platform.OS) == 'ios' ? 20 : 0 }}>

    <Header style = {{backgroundColor: '#ffffff'}}>
          <Left />
          <Body style = {{backgroundColor: '#ffffff'}}>
            <Title>DA EATZ</Title>
            <Subtitle> Date Today: {this.state.today}</Subtitle>
          </Body>
          <Right />
        </Header>

  <FlatList
    style={{marginBottom: 70}}
    data={this.state.displayArray}
    renderItem={ ({ item }) => {
    if (item.header) {
      return (
        <ListItem itemDivider>
         
            <Text style = {{fontFamily: 'helvetica', fontWeight: 'bold', paddingRight: 10,}}>
              {item.date}
            </Text>
             
          
          <Right />
        </ListItem>
      );
    } else if (!item.header) {
      return (
        //onPress={this.GetSectionListItem.bind(this, item)}

        <ListItem style={{ flex: 1, flexDirection: 'column'}}>
          
            <Text style={{flexDirection:'row', fontFamily: 'helvetica', alignSelf:'flex-start'}} >{item.name}: {item.cal} calories</Text>

        </ListItem>
      );
    }
  }}

        keyExtractor={item => item.name}
        stickyHeaderIndices={this.state.stickyHeaderIndices}





        

      
      />

       

      </View>
      


    )

}







  constructor(props){
  super(props);
    let now = new Date();

  this.state={
    today:date.format(now, 'YYYY-MM-DD'),
    breakfast: [],
    lunch: [],
    dinner: [],
    storedData: {},
    sections: [],
    index: 0,
    routes: [
      { key: 'first', title: 'Menu' },
      { key: 'second', title: 'My Eatz History' },
    ],
    
  }

}

alertedMessage=(item)=>{
  Alert.alert(
  'Are you sure you want to add this to your Eatz history?',
  'Confirm Below',
  [
    {text: 'Whoops, No Thanks', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'Add away', onPress: () => this.addItem(item) },
  ],
  { cancelable: false }
)

}


addItem=(item) =>{

console.log('item being add', item)

AsyncStorage.getItem('addedFood').then(result => {
  if(result){
    result = JSON.parse(result);
    console.log('result', result)

   var added=false

    for(i=0; i< result.length; i++){
      if(item.tdate == result[i].date){
        result[i].data.push(item);
        result[i].totalCal = result[i].totalCal + item.cal
        added = true
      } 
    }

    if(added==false){
      result.push({date: item.tdate, totalCal: item.cal, data: [item]})

    }

    AsyncStorage.setItem('addedFood', JSON.stringify(result))

    result.reverse()

    var displayArray = [];

    for(x = 0; x < result.length; x++){

      displayArray.push({date: result[x].date+ " " + "Total Calories:" + " " + result[x].totalCal, header: true})
      displayArray = displayArray.concat(result[x].data)

    }
    console.log('displayed Array', displayArray)
    this.setState({
      displayArray: displayArray
    })



    //run here

  } else{

    var sections=[]

    var foodcollection={
      date: item.tdate,
      totalCal:item.cal,
      data:[item]
    }

    sections.push(foodcollection)
    console.log('first Item', sections)

    AsyncStorage.setItem('addedFood', JSON.stringify(sections))
    //run here
    sections.reverse();

    var displayArray = [];

    for(x = 0; x < sections.length; x++){

      displayArray.push({date: sections[x].date+ " " + "Total Calories:" + " " + sections[x].totalCal, header: true})
      displayArray = displayArray.concat(sections[x].data)

    }
    console.log('displayed Array', displayArray)
    this.setState({
      displayArray: displayArray
    })

  }

})


}
// to make a button to display data
/*
  displayData = async () => {
    try{
      console.log("1");
      addedFood = await AsyncStorage.getItem('addedFood');
      
      let parsedFood = JSON.parse(addedFood);
            
      alert(JSON.stringify(parsedFood));
    }

    catch(error){
      alert(error);
    }
  }
  */




componentWillMount(){

  const serverURL = "https://evening-wildwood-37327.herokuapp.com/getfoodinfo";
  //AsyncStorage.clear();
  var copysections = [];
  fetch(serverURL).then((response) => response.text()).then((response) =>{
    console.log("thisworksnow");
    var fetchedData = JSON.parse(response)

    this.setState({
      fetchedData: fetchedData
    })
    console.log('fetchedData', fetchedData);

    
    

  AsyncStorage.getItem('addedFood').then(result=> {
    if(result){
      result = JSON.parse(result)
     result.reverse()

    var displayArray = [];

    for(x = 0; x < result.length; x++){

      displayArray.push({date: result[x].date+ " " + "Total Calories:" + " " + result[x].totalCal, header: true})
      displayArray = displayArray.concat(result[x].data)

    }
    console.log('displayed Array', displayArray)
    this.setState({
      displayArray: displayArray
    })

  }})


    
    




  });



  
}







  render() {


    return (


       <TabView 

          renderTabBar={props =>
            <TabBar
            {...props}
          indicatorStyle={{ backgroundColor: 'white' }}
          tabStyle={{color: 'black'}}
          style={{backgroundColor: 'black'}}

          
            />
          }
          
        navigationState={this.state}
        renderScene={SceneMap({
          first: this.FirstRoute.bind(this),
          second: this.SecondRoute.bind(this),
        })}
        onIndexChange={index => this.setState({ index }, ()=>{
          console.log('5')
        })}
        initialLayout={{ width: Dimensions.get('window').width,height: Dimensions.get('window').height  }}
        tabBarPosition={'bottom'}
      />




    );
  





  }










}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  SectionHeaderStyle:{
 
    backgroundColor : '#e8e8e8',
    fontSize : 20,
    padding: 5,
    color: '#4b4b4b',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  SectionListItemStyle:{
 
    fontSize : 15,
    padding: 5,
    color: '#000',
    backgroundColor : '#F5F5F5',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
 
  },
 
  tabBarDesign:{
 
    fontSize : 15,
    color: 'pink'
    
 
  },
  subtitleStyle:{
    textAlign: 'right'
  }
});
