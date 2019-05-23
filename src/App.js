import React, { Component } from 'react'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  LineChart,
} from 'recharts'
import moment from 'moment'

const firebase = require('firebase/app')
require('firebase/database')

var firebaseConfig = {
  apiKey: "AIzaSyDIFM8bHn41NJjnH_-tcfBzOA_ecL1YsZ0",
  authDomain: "swp-exam.firebaseapp.com",
  databaseURL: "https://swp-exam.firebaseio.com",
  projectId: "swp-exam",
  storageBucket: "swp-exam.appspot.com",
  messagingSenderId: "232730242474",
  appId: "1:232730242474:web:be2eeb20ce87f98b"
};
var app = firebase.initializeApp(firebaseConfig);


class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      latest_time: ""
    }
  }

  componentDidMount = () => {
    const { message } = this.state
    firebase.database().ref('/key').on('value', (snapshot) => {
      this.setState({message: snapshot.val()})
    })
  }

  render() {
    const { message } = this.state
    const data = []
    let i = 1;
    Object.keys(message).forEach(m => {
      var t = moment.unix(m/1000).utc(7).format("hh:mm a")
      let a = t.split(":")
      if(i !== 1){
        var latest_t = data[data.length - 1].time.split(":")[0]
        if(latest_t !== a[0]) {
          data.push({time: a[0] + ":00", count: 1})
          i = 2
        }
        if(latest_t === a[0]) {
          data[data.length - 1].count = i
          i++
        }
      } else {
        data.push({time: a[0] + ":00", count: i})
        i++
      } 
    })

    return (
      <div>
        <div>
          <LineChart width={1250} height={700} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey='time'
            />
            <YAxis
              dataKey = 'count'
              name = 'Count'/>
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="count" stroke="#8884d8"  activeDot={{ r: 8 }}/>
          </LineChart>
        </div>
        <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            Object.values(message).map((data, i) =>
            {
              const key = Object.keys(data)
             return  <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {data[key[0]]}
              </div>
            }
            )
          }
        </div>
      </div>
    )
  }
}

export default App