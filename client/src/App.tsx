import { useEffect, useState } from 'react'
import axios from 'axios';
import reactLogo from './assets/react.svg'
import './App.css'
import JoScore from './JoScore';

type ResType = { type: string, teams: string[], scores: number[] }[];
type DataType = {
  jo: {
    [jo: string]: {
      teams: string[], scores: number[]
    }[]
  },
  tn: {
    [lv: string]: {
      teams: string[], scores: number[]
    }[]
  }
}

function App() {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    axios.get<any>("http://localhost:3000/result").then((res) => {
      const newData: DataType = {
        jo: {},
        tn: {},
      };

      for (const e of res.data as ResType) {
        const match = e.type.match(/조별리그 ([A-H])조/);
        if (match?.length && match.length > 1) {
          const jo = match[1];
          if (!Array.isArray(newData.jo[jo])) {
            newData.jo[jo] = [];
          }
          newData.jo[jo].push({
            teams: e.teams,
            scores: e.scores
          });
        }
        else {
          let lv: string = "";
          switch (e.type) {
            case '16강': lv = '16'; break;
            case '8강': lv = '8'; break;
            case '준결승': lv = '4'; break;
            case '3위결정전': lv = '3'; break;
            case '결승': lv = '2'; break;
          }
          if (!Array.isArray(newData.tn[lv])) {
            newData.tn[lv] = [];
          }
          newData.tn[lv].push({
            teams: e.teams,
            scores: e.scores
          })
        }
      }

      "ABCDEFGH".split('').forEach((jo) => {
        newData.jo[jo].sort((a, b) => a.teams[1].localeCompare(b.teams[1]));
        newData.jo[jo].sort((a, b) => a.teams[0].localeCompare(b.teams[0]));
      });

      const key: { [k: string]: number } = {
        네덜란드: 1,
        미국: 1,
        아르헨티나: 2,
        호주: 2,
        일본: 3,
        크로아티아: 3,
        브라질: 4,
        대한민국: 4,
        잉글랜드: 5,
        세네갈: 5,
        프랑스: 6,
        폴란드: 6,
        모로코: 7,
        스페인: 7,
        포르투갈: 8,
        스위스: 8,
      };

      [16, 8, 4].forEach(i => newData.tn[i].sort((a, b) => key[a.teams[0]] - key[b.teams[0]]));

      setData(newData);
    })
  }, []);

  if (!data) {
    return <div>
      Loading...
    </div>
  }

  return (
    <div className="App">
      <h1>카타르 알려줘</h1>
      <h2>조별리그</h2>
      <div id="jo-container">
        {"ABCDEFGH".split('').map(jo => (
          <div className='jo-item'>
            <h3 className='jo-title'>{jo}조</h3>
            {data.jo[jo].map((joData, idx) => (
              <>
                {idx > 0 ? <hr className='divider' /> : null}
                <JoScore teams={joData.teams} scores={joData.scores} />
              </>
            ))}
          </div>
        ))}
      </div>
      <br />
      <h2>토너먼트</h2>
      <div id="tn-container">
        {[16, 8, 4].map(i => (
          <div className="tn-column">
            <h3 className='tn-title'>{i}강</h3>
            <div className='tn-column-content'>
              {data.tn[i].map(tn => (
                <>
                  <div className="tn-item">
                    <JoScore teams={tn.teams} scores={tn.scores} />
                  </div>
                  {
                    (Array.from(new Array(16 / i - 1), () => (
                      <div className='tn-item hidden'>.</div>
                    )))
                  }
                </>
              ))}
            </div>
          </div>
        ))}
        <div className="tn-column">
          <h3 className='tn-title'>결승전</h3>
          <div className="tn-item">
            <JoScore teams={data.tn[2][0].teams} scores={data.tn[2][0].scores} />
          </div>
          <br />
          <br />
          <h3 className='tn-title'>3위 결정전</h3>
          <div className="tn-item">
            <JoScore teams={data.tn[3][0].teams} scores={data.tn[3][0].scores} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

