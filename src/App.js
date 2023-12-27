import './App.css';
import React, {useEffect, useState, useRef} from 'react'
import Plot from 'react-plotly.js'

function App() {
  let BLUE = 'rgba(27, 84, 255, 1)'
  BLUE = 'rgba(0, 0, 255, 1)'
  let RED = 'rgba(255, 20, 25, 1)'
  RED = 'rgba(255,0,0, 1)'
  const GREEN = 'rgba(9, 230, 9, 1)'
  const YELLOW = 'rgba(255, 236, 29, 1)'

  const [xval, setXval] = useState([...Array(70).keys()].map(x => ++x));
  const [yval, setYval] = useState([...Array(70).keys()].map(x => ++x));
  const [color, setColor] = useState([...Array(70).keys()].map(x => ++x));
  const [size, setSize] = useState(70);
  //const [speed, setSpeed] = useState(20);
  const speed = useRef(20)
  const [speedDisplay, setSpeedDisplay] = useState(20)
  const [disabled, setDisabled] = useState(false)
  const stop = useRef(false)
  const wasRunning = useRef(false)
  const colorChange = useRef(false)
  const algorithm = useRef("Quick Sort")
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHight, setWindowHeight] = useState(window.innerHeight)
  const lightMode = useRef(false)
  const titleColor = useRef('black')

  useEffect(() => {
    colorMode()
    function handleResize() {
      let width = window.innerWidth
      let height = window.innerHeight/1.5
      setWindowWidth(width)
      setWindowHeight(height)
    }
    shuffle(70)
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight/1.5)
    window.addEventListener('resize', handleResize)
  }, [])


  function timeout(delay) {return new Promise( res => setTimeout(res, delay) );}

  let shuffle = async (e) => {
    stop.current = true
    await timeout(speed.current*2)
    var x = []; var y = []; var col = [];
    for (let i = 0; i < e; i++) {
      x[i] = i; y[i] = i + 1;
    }
    for (var i = e - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = y[i];
      y[i] = y[j];
      y[j] = temp;
    }
    let u = 155/e
    for (let i = 0; i < e; i++) {
      if (lightMode.current){ col[i] =  `rgb(0,${80+y[i]*u/2},${200+y[i]*u},1)`}
      else {col[i] = y[i];}
    }
    stop.current = false
    setXval(x); setYval(y); setColor(col); setSize(e);
  };
  
  let sort = async(event) => {
    if (algorithm.current === "Bubble Sort") { bubble() }
    if (algorithm.current === "Insertion Sort") { insertion() }
    if (algorithm.current === "Quick Sort") {
      quickSort(0, yval.length-1)
    }
    if (algorithm.current === "Merge Sort") {
      mergeSort(yval, 0, yval.length-1)
    }
    if (wasRunning.current) {
      sort(); wasRunning.current = false;
    }
  }

  let bubble = async () => {
    let col = color
    for (let i = 0; i < yval.length; i++) {
      col[i] = GREEN
      if (lightMode.current) {
        col[i-1] = `rgb(0,${80+yval[i-1]*155/col.length/2},${200+yval[i-1]*155/col.length},1)`;
      } else{
        col[i-1] = yval[i-1];
      }
      if (stop.current) {return}
      if (colorChange.current) {
        changeColor()
        colorChange.current = false
      }
      for (let j = 0; j < yval.length; j++) {
        let list = yval;
        if (list[j] > list[i]) {
          let tmp = list[i]; list[i] = list[j]; list[j] = tmp;
        } let temp = list;

        if (col[j-1] !== GREEN) {
          if (lightMode.current) {
            col[j-1] = `rgb(0,${80+yval[j-1]*155/col.length/2},${200+yval[j-1]*155/col.length},1)`
          } else {
            col[j-1] = yval[j-1]
          }
          if (col[j] !== GREEN) {
            if (lightMode.current) {
              col[j] = RED;
            } else {
              col[j] = BLUE;
            }
          }
        } else {
          if (lightMode.current) {
            col[j] = RED
          } else {
            col[j] = BLUE
          }
        }
        
        setColor(col.slice(0, col.length))
        setYval(temp.slice(0, yval.length));
        if (stop.current) {return}
        if (colorChange.current) {
          changeColor()
          colorChange.current = false
        }
        await timeout(speed.current);
      }
      if (lightMode.current) {
        col[col.length-1] = `rgb(0,${80+yval[col.length-1]*155/col.length/2},${200+yval[col.length-1]*155/col.length},1)`
      } else {
        col[col.length-1] = yval[col.length-1]
      }
    }
    col[col.length] = yval[col.length]
    setColor(col.slice(0, col.length))

  }

  let insertion = async () => {
    for (let i = 0; i< yval.length-1; i++) {
      if (stop.current) {return}
      if (colorChange.current) {
        changeColor()
        colorChange.current = false
      }
      let col = color; col[i] = GREEN
      if (lightMode.current) {
        col[i-1] = `rgb(0,${80+yval[i-1]*155/col.length/2},${200+yval[i-1]*155/col.length},1)`
      } else {col[i-1] = yval[i-1]}
      
      let list = yval
      let k = i
      for (let j = i+1; j < yval.length; j++) {
        if (k !== i && k !== j) {col[k] = YELLOW}
        if (lightMode.current) {
          col[j] = RED
          if (col[j-1] === RED) {col[j-1] = `rgb(0,${80+yval[j-1]*155/col.length/2},${200+yval[j-1]*155/col.length},1)`}
        }
        else {
          col[j] = BLUE;
          if (col[j-1] === BLUE) {col[j-1] = yval[j-1]}
        }
        if (list[j] < list[k]) {
          if (col[k] === YELLOW) {
            if (lightMode.current) {col[k] = `rgb(0,${80+yval[k]*155/col.length/2},${200+yval[k]*155/col.length},1)`}
            else {col[k] = yval[k]}
          }
          k = j
        }
        if (j === i+1) {
          if (lightMode.current) {col[col.length-1]=`rgb(0,${80+yval[col.length-1]*155/col.length/2},${200+yval[col.length-1]*155/col.length},1)`}
          else {col[col.length-1] = yval[col.length-1]}
        }
        if (j === col.length-1) {
          if (lightMode.current) {col[k]=`rgb(0,${80+yval[k]*155/col.length/2},${200+yval[k]*155/col.length},1)`}
          else {col[k] = yval[k]}
        }
        // if (j == col.length-1) {col[col.length-1] = a}
        if (stop.current) {return}
        if (colorChange.current) {
          changeColor()
          colorChange.current = false
        }
        await timeout(speed.current);
        setColor(col.slice(0, yval.length));
      }
      let tmp = list[i]; list[i] = list[k]; list[k] = tmp
      let temp = list
      if (lightMode.current) {col[k]=`rgb(0,${80+temp[k]*155/col.length/2},${200+temp[k]*155/col.length},1)`}
      else {col[k] = temp[k]}
      setYval(temp.slice(0, yval.length));
      // col[col.length-1] = a;
      if (lightMode.current) {col[col.length-2]=`rgb(0,${80+yval[col.length-2]*155/col.length/2},${200+yval[col.length-2]*155/col.length},1)`}
      else {col[col.length-2] = yval[col.length-2]}
      setColor(col.slice(0, yval.length));
    }
  }

  let swap = async (i, j) => {
    let list = yval;
    let tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    await timeout(speed.current);
    setYval(list.slice(0, yval.length));
  }
  let partition = async (l, h) => {
    let col = color
    let x = yval[h]
    let i = l-1
    for (let j = l; j <= h-1; j++) {
      col[i] = GREEN
      if (lightMode.current) {
        col[j] = RED
      } else {col[j] = BLUE}
      col[l] = YELLOW
      col[h] = YELLOW
      setColor(col.slice(0, yval.length))
      if (yval[j] <= x) {
        i++
        if (stop.current) {return}
        if (colorChange.current) {
          // changeColor()
          colorChange.current = false
        }
        await swap(i, j)
        if (lightMode.current) {
          col[i]=`rgb(0,${80+yval[i]*155/col.length/2},${200+yval[i]*155/col.length},1)`
          col[j]=`rgb(0,${80+yval[j]*155/col.length/2},${200+yval[j]*155/col.length},1)`
        } else {
          col[j] = yval[j]
          col[i] = yval[i]
        }
        if (lightMode.current) {
          col[i-1]=`rgb(0,${80+yval[i-1]*155/col.length/2},${200+yval[i-1]*155/col.length},1)`
        } else {
          col[i - 1] = yval[i - 1]
        }
        if (j !== l) {
          if (lightMode.current) {
            col[l]=`rgb(0,${80+yval[l]*155/col.length/2},${200+yval[l]*155/col.length},1)`
          } else {col[l] = yval[l]}
        }
        if (i !== h) {
          if (lightMode.current) {
            col[h]=`rgb(0,${80+yval[h]*155/col.length/2},${200+yval[h]*155/col.length},1)`
          } else {col[h] = yval[h]}
        }
        if (colorChange.current) {
          changeColor()
          colorChange.current = false
        }
        setColor(col.slice(0, yval.length))
        continue
      } else {
        if (lightMode.current) {
          col[i]=`rgb(0,${80+yval[i]*155/col.length/2},${200+yval[i]*155/col.length},1)`
          col[j]=`rgb(0,${80+yval[j]*155/col.length/2},${200+yval[j]*155/col.length},1)`
        } else {
          col[i] = yval[i]
          col[j] = yval[j]
        }
      }
      if (lightMode.current) {
        col[l]=`rgb(0,${80+yval[l]*155/col.length/2},${200+yval[l]*155/col.length},1)`
        col[h]=`rgb(0,${80+yval[h]*155/col.length/2},${200+yval[h]*155/col.length},1)`
      } else {
        col[l] = yval[l]
        col[h] = yval[h]
      }
      if (colorChange.current) {
        changeColor()
        colorChange.current = false
      }
      setColor(col.slice(0, yval.length))
    }
    if (stop.current) {return}
    if (colorChange.current) {
      // changeColor()
      colorChange.current = false
    }
    await swap(i+1, h)
    for (let i = 0; i < col.length; i++) {
      if (lightMode.current) {
        col[i]=`rgb(0,${80+yval[i]*155/col.length/2},${200+yval[i]*155/col.length},1)`
      } else {
        col[i] = yval[i]
      }
    }
    setColor(col.slice(0, yval.length))
    return i+1
  }
  let quickSort = async (l, h) => {
    if (stop.current) {return}
    if (colorChange.current) {
      // changeColor()
      colorChange.current = false
    }
    if (l < h) {
      let p = await partition(l, h)
      await quickSort(l, p-1)
      await quickSort(p+1, h)
    }
  }

  const mergeSort = async (arr,l, r) => {
    if (stop.current) {return}
    if (colorChange.current) {
      changeColor()
      colorChange.current = false
    }
    if(l >= r){ return; }
    var m = l + Math.floor((r - l)/2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m+1, r);
    await merge(arr, l, m, r);
    // let col = color
    // for (let i = l; i < r; i++) {
    //   col[i] = yval[i]
    // }
    // setColor(col.slice(col.length))
  }

  const merge = async (arr, l, m, r) => {
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = []
    let R = []
    let col = color
 
    for (let i = 0; i < n1; i++)
        L.push(arr[l + i])
    for (let j = 0; j < n2; j++)
        R.push(arr[m + 1 + j])
 
    let i = 0;
    let j = 0;
    let k = l;
 
    while (i < n1 && j < n2) {
        if (stop.current) {return}
        if (colorChange.current) {
          changeColor()
          colorChange.current = false
        }
        col[l + i] = GREEN;
        
        setColor(col.slice(0, yval.length));
        if (lightMode.current) {
          col[m + j + 1] = RED;
          col[m + j] = `rgb(0,${80+yval[m + j]*155/col.length/2},${200+yval[m + j]*155/col.length},1)`
        } else {
          col[m + j + 1] = BLUE
          col[m + j] = yval[m + j]
        }
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            if (lightMode.current) {
              col[l + i] = `rgb(0,${80+L[i]*155/col.length/2},${200+L[i]*155/col.length},1)`
            } else {
              col[l + i] = L[i] 
            }
            i++;
        }
        else {
            arr[k] = R[j];
            if (lightMode.current) {
              col[m + j] = `rgb(0,${80+yval[m+j]*155/col.length/2},${200+yval[m+j]*155/col.length},1)`
            } else {
              col[m + j] = yval[m + j]
            }
            j++;
        }
        k++;
        await timeout(speed.current)
        setColor(col.slice(0, yval.length));
    }
     while (i < n1) {
        if (stop.current) {return}
        arr[k] = L[i];
        i++;
        k++;
    }
     while (j < n2) {
        if (stop.current) {return}
        arr[k] = R[j];
        j++;
        k++;
    }
    for (let i = 0; i < color.length; i++) {
      if (lightMode.current) {
        col[i] = `rgb(0,${80+yval[i]*155/col.length/2},${200+yval[i]*155/col.length},1)`
      } else {
        col[i] = yval[i];
      }
    }
    setColor(col.slice(0, yval.length));
    setYval(arr.slice(0, yval.length))
}
const submit = async () => {
    stop.current=true;
    await timeout(speed.current*2);
    for (let i = 0; i < yval.length; i++) {
      if (lightMode.current) {color[i] = `rgb(0,${80+yval[i]*155/color.length/2},${200+yval[i]*155/color.length},1)`}
      else {color[i] = yval[i]}
    }
    setColor(color.slice(0, color.length))
    setDisabled(false)
    stop.current = false;sort()
}
const changeColor = () => {
  let col = color
  for (let i = 0; i < col.length; i++) {
    if (col[i] === GREEN || col[i] === YELLOW) {continue}
    if (lightMode.current){ col[i] = `rgb(0,${80+yval[i]*155/color.length/2},${200+yval[i]*155/color.length},1)`}
    else {col[i] = yval[i]}
  }
  setColor(col.slice(0, col.length))
}

const colorMode = async () => {
  lightMode.current = !lightMode.current;
  colorChange.current = true
  changeColor()

  if (lightMode.current) {
    document.body.style.backgroundColor = "white";
    document.getElementsByClassName("App")[0].style.color = "black"
    document.getElementsByClassName("header")[0].style.backgroundColor = "#089cfc"
    document.getElementsByClassName("colorMode")[0].textContent ="Dark Mode"

    document.documentElement.style.setProperty('--first', 'rgba(50, 50, 93, .1)');
    document.documentElement.style.setProperty('--second', 'rgba(50, 50, 93, .2)');
    document.documentElement.style.setProperty('--third', 'rgba(0, 0, 0, .1)');
    document.documentElement.style.setProperty('--fourth', 'rgba(50, 151, 211, .3)');
    document.documentElement.style.setProperty('--theme-color', '#089cfc');
    document.documentElement.style.setProperty('--button-color', '#405cf5');

    for (let i=0; i<document.getElementsByClassName("button").length;i++) {
      document.getElementsByClassName("button")[i].style.backgroundColor='#405cf5'
    }
    titleColor.current = 'black'
  } else {
    document.body.style.backgroundColor = "black";
    document.getElementsByClassName("App")[0].style.color = "white"
    document.getElementsByClassName("header")[0].style.backgroundColor = "#c8342c"
    document.getElementsByClassName("colorMode")[0].textContent ="Light Mode"
    
    document.documentElement.style.setProperty('--first', 'rgba(93, 51, 51, 0.1)');
    document.documentElement.style.setProperty('--second', 'rgba(93, 51, 51, 0.2)');
    document.documentElement.style.setProperty('--third', 'rgba(0, 0, 0, .1)');
    document.documentElement.style.setProperty('--fourth', 'rgba(195, 54, 54, 0.3)');
    document.documentElement.style.setProperty('--theme-color', '#c8342c');
    document.documentElement.style.setProperty('--button-color', '#c73834');

    for (let i=0; i<document.getElementsByClassName("button").length;i++) {
      document.getElementsByClassName("button")[i].style.backgroundColor='#c73834'
    }
    titleColor.current = 'white'
  }
}

  return (
    <div className="App" color='white'>
      <div className="header">
        <span className='title'><h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sorting Algorithms</h1></span>
        <span className='name'><p>Boris &#160;&#160;</p><p>Jancic&#160;</p></span>
      </div>
      <div className='main'>
        <div className='colorModeDiv'>
          <button className='colorMode button' onClick={colorMode}>Mode</button>
        </div>
        <div className='graph'>
        <Plot
            data={[
              {type: 'bar',
              'x': xval,
              'y': yval,
              marker:{
                color: color
              },},
            ]}
            layout={{width: windowWidth, height: windowHight, title: {text: algorithm.current, font: {size: 25}}, displaylogo: false, xaxis: {visible: false}, yaxis: {visible: false}, bargap: 0, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font: {color:titleColor.current}, margin: { b: 10 }}}
            config={{
              displayModeBar: false,
              scrollZoom: false,
              displayModeBar: false,
              responsive: false,
              staticPlot: true,
            }}
        />
        </div>
        <div className='buttons'>
          <div className='shuffle'>
            <button className='button' value={size} onClick={(e) => shuffle(e.target.value)}>Shuffle</button>
          </div>
          <div className='size'>
            <span>Size  &#160; </span>
            <input type="range" className="slider" value={size} onChange={async (e) => {shuffle(e.target.value)}} min="1" max="100"></input> {size} bars<br/>
          </div>
          <div className='speed'>
            Speed &#160;
            <input type="range" className="slider" defaultValue={20} onChange={(e) => {speed.current = e.target.value;console.log(speed.current);setSpeedDisplay(e.target.value)}} min="10" max="100"></input> {speedDisplay} ms<br/>
          </div>
          <div className='algorithm custom-select'>
            Algorithm <br></br>
            <select onChange={(e) => algorithm.current = e.target.value}>
              <option value="Quick Sort">Quick Sort</option>
              <option value="Bubble Sort">Bubble Sort</option>
              <option value="Insertion Sort">Insertion Sort</option>
              <option value="Merge Sort">Merge Sort</option>
            </select>
          </div>
          <div className='sort'>
            <button className='button' type="submit" onClick={()=>{setDisabled(true); submit();}
              } disabled={disabled}>Sort</button><br/>
          </div>
          <div className='sort'>
            <button className='button' onClick={async () => {stop.current = true}}>Stop</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;